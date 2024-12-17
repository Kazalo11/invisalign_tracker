package day

import (
	"time"

	"github.com/Kazalo11/invsalign_tracker/database"
	"github.com/pocketbase/pocketbase"
)

func CreateDayRecordForUsers(app *pocketbase.PocketBase) func() {
	return func() {
		currentTime := time.Now()
		users := database.GetAllUsers(app)
		for _, user := range users {
			id := user.Id
			_, err := database.FetchDayRecordByUser(app, id, currentTime)
			if err != nil {
				database.CreateDayRecord(app, id)
			}

		}
	}

}