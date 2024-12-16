package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

const DefaultDateLayout = "2006-01-02 15:04:05.000Z"

type LogTimeData struct {
	TimeOut int    `json:"timeOut"`
	UserId  string `json:"userId"`
}

func LogTime(app *pocketbase.PocketBase) func(e *core.ServeEvent) error {
	return func(se *core.ServeEvent) error {
		se.Router.POST("/api/internals/log-time", logTimeHandler(app)).Bind(apis.RequireAuth())
		return se.Next()
	}
}

func logTimeHandler(app *pocketbase.PocketBase) func(e *core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		data := LogTimeData{}
		if err := e.BindBody(&data); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		}

		startOfDay, endOfDay := getDayRange()

		dayRecord, err := fetchDayRecord(app, startOfDay, endOfDay)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch day record"})
		}

		totalTime := dayRecord.GetInt("totalTimeOut")
		newTotalTime := totalTime + data.TimeOut

		if err := app.RunInTransaction(func(txApp core.App) error {
			// Save the new time record
			if err := saveTimeRecord(txApp, data); err != nil {
				return err
			}

			dayRecord.Set("totalTimeOut", newTotalTime)
			return txApp.Save(dayRecord)
		}); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Database transaction failed due to err %v", err)})
		}

		return e.JSON(http.StatusCreated, map[string]string{"message": "Time record successfully created, day record updated"})
	}
}

func getDayRange() (string, string) {
	startOfDay := time.Now().Truncate(24 * time.Hour)
	endOfDay := startOfDay.Add(24 * time.Hour)
	return startOfDay.Format(DefaultDateLayout), endOfDay.Format(DefaultDateLayout)
}

func fetchDayRecord(app *pocketbase.PocketBase, startOfDay, endOfDay string) (*core.Record, error) {
	return app.FindFirstRecordByFilter(
		"days",
		"created >= {:start} && created <= {:end}",
		dbx.Params{"start": startOfDay, "end": endOfDay},
	)
}

func saveTimeRecord(txApp core.App, data LogTimeData) error {
	collection, err := txApp.FindCollectionByNameOrId("times")
	if err != nil {
		return err
	}
	timeRecord := core.NewRecord(collection)
	timeRecord.Set("timeOut", data.TimeOut)
	timeRecord.Set("user", data.UserId)
	return txApp.Save(timeRecord)
}
