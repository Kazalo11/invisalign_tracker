package main

import (
	"log/slog"

	"github.com/Kazalo11/invsalign_tracker/api"
	"github.com/Kazalo11/invsalign_tracker/cron/day"
	"github.com/Kazalo11/invsalign_tracker/cron/email"
	"github.com/pocketbase/pocketbase"
)

func main() {
	app := pocketbase.New()
	app.OnServe().BindFunc(api.LogTime(app))
	if err := app.Cron().Add("emailYesterdayResults", "0 7 * * *", email.EmailYesterdayResults(app)); err != nil {
		slog.Error("Error adding cron job", "Error", err)
	}
	if err := app.Cron().Add("createDayRecord", "0 0 * * *", day.CreateDayRecordForUsers(app)); err != nil {
		slog.Error("Error adding cron job", "Error", err)
	}

	if err := app.Start(); err != nil {
		slog.Error("Error starting backend", "Error", err)
	}

}
