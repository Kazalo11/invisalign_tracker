package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Kazalo11/invsalign_tracker/database"
	"github.com/Kazalo11/invsalign_tracker/utils"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

const DefaultDateLayout = "2006-01-02 15:04:05.000Z"

func LogTime(app *pocketbase.PocketBase) func(e *core.ServeEvent) error {
	return func(se *core.ServeEvent) error {
		se.Router.POST("/api/internals/log-time", logTimeHandler(app)).Bind(apis.RequireAuth())
		return se.Next()
	}
}

func logTimeHandler(app *pocketbase.PocketBase) func(e *core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		data := utils.LogTimeData{}
		if err := e.BindBody(&data); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		}

		startOfDay, endOfDay := getDayRange()

		dayRecord, err := database.FetchDayRecord(app, startOfDay, endOfDay)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Failed to fetch day record due to error: %v", err)})
		}

		if err := database.TransactItems(app, dayRecord, data); err != nil {
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