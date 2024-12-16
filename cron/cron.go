package cron

import (
	"fmt"
	"net/mail"
	"time"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/tools/mailer"
)

func EmailYesterdayResults(app *pocketbase.PocketBase) func() {
	currentDate := time.Now()

	yesterday := currentDate.Add(-24 * time.Hour)

	day := yesterday.Format("2")
	month := yesterday.Format("Jan")
	year := yesterday.Format("2006")

	yesterdayFormatted := fmt.Sprintf("%s %s, %s", month, day, year)

	return func() {
		message := &mailer.Message{
			From: mail.Address{
				Address: app.Settings().Meta.SenderAddress,
				Name:    app.Settings().Meta.SenderName,
			},
			Subject: fmt.Sprintf("Invisalign Wearing Roundup for %s", yesterdayFormatted),
		}

		app.NewMailClient().Send(message)
	}
}
