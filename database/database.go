package database

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func FetchDayRecord(app *pocketbase.PocketBase, startOfDay, endOfDay string) (*core.Record, error) {
	return app.FindFirstRecordByFilter(
		"days",
		"created >= {:start} && created <= {:end}",
		dbx.Params{"start": startOfDay, "end": endOfDay},
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
