package database

import (
	"log/slog"
	"time"

	"github.com/Kazalo11/invsalign_tracker/utils"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func FetchDayRecord(app *pocketbase.PocketBase, day time.Time) (*core.Record, error) {
	startOfDay, endOfDay := utils.GetDayRange(day)

	return app.FindFirstRecordByFilter(
		"days",
		"created >= {:start} && created <= {:end}",
		dbx.Params{"start": startOfDay, "end": endOfDay},
	)
}
func FetchDayRecordByUser(app *pocketbase.PocketBase, userId string, day time.Time) (*core.Record, error) {
	startOfDay, endOfDay := utils.GetDayRange(day)
	return app.FindFirstRecordByFilter(
		"days",
		"created >= {:start} && created <= {:end} && user ={:userId}",
		dbx.Params{"start": startOfDay, "end": endOfDay, "userId": userId},
	)

}

func SaveTimeRecord(txApp core.App, timeOut int, userId, dayID string) error {
	collection, err := txApp.FindCollectionByNameOrId("times")
	if err != nil {
		return err
	}
	timeRecord := core.NewRecord(collection)
	timeRecord.Set("timeOut", timeOut)
	timeRecord.Set("user", userId)
	timeRecord.Set("day", dayID)
	return txApp.Save(timeRecord)
}

func TransactItems(app *pocketbase.PocketBase, dayRecord *core.Record, data utils.LogTimeData) error {
	if err := app.RunInTransaction(func(txApp core.App) error {
		totalTime := dayRecord.GetInt("totalTimeOut")
		dayID := dayRecord.GetString("id")
		newTotalTime := totalTime + data.TimeOut
		dayRecord.Set("totalTimeOut", newTotalTime)

		if err := SaveTimeRecord(txApp, data.TimeOut, data.UserId, dayID); err != nil {
			return err
		}
		return txApp.Save(dayRecord)

	}); err != nil {
		return err
	}
	return nil

}

func GetAllUsers(app *pocketbase.PocketBase) []*core.Record {
	records, err := app.FindAllRecords("users")
	if err != nil {
		slog.Error("Can't get records due to error", "Error", err)
		return nil
	}
	return records

}

func CreateDayRecord(app *pocketbase.PocketBase, userId string) error {
	collection, err := app.FindCollectionByNameOrId("days")
	if err != nil {
		return err
	}
	record := core.NewRecord(collection)
	record.Set("totalTimeOut", 0)
	record.Set("user", userId)
	record.Set("success", false)

	return app.Save(record)
}
