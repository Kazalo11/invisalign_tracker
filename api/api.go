package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Kazalo11/invsalign_tracker/database"
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

		dayRecord, err := database.FetchDayRecord(app, startOfDay, endOfDay)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch day record"})
		}

		totalTime := dayRecord.GetInt("totalTimeOut")
		dayID := dayRecord.GetString("id")
		newTotalTime := totalTime + data.TimeOut

		if err := app.RunInTransaction(func(txApp core.App) error {
			if err := database.SaveTimeRecord(txApp, data.TimeOut, data.UserId, dayID); err != nil {
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
