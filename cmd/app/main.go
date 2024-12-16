package main

import (
	"log/slog"

	"github.com/Kazalo11/invsalign_tracker/api"
	"github.com/pocketbase/pocketbase"
)

func main() {
	app := pocketbase.New()
	app.OnServe().BindFunc(api.LogTime(app))

	if err := app.Start(); err != nil {
		slog.Error("Error starting backend", "Error", err)
	}

}
