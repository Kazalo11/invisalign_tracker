package email

import (
	"bytes"
	"fmt"
	"html/template"
	"net/mail"
	"time"

	"github.com/Kazalo11/invsalign_tracker/database"
	"github.com/Kazalo11/invsalign_tracker/utils"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/tools/mailer"
	"golang.org/x/exp/slog"
)

func EmailYesterdayResults(app *pocketbase.PocketBase) func() {
	currentDate := time.Now()

	yesterday := currentDate.Add(-24 * time.Hour)

	day := yesterday.Format("2")
	month := yesterday.Format("Jan")
	year := yesterday.Format("2006")

	yesterdayFormatted := fmt.Sprintf("%s %s, %s", month, day, year)

	tmpl, err := template.ParseFiles("templates/template.html")
	if err != nil {
		slog.Error("Error parsing template:", "Error", err)
		return nil
	}

	return func() {
		users := database.GetAllUsers(app)

		for _, user := range users {
			dayRecord, err := database.FetchDayRecordByUser(app, user.Id, yesterday)
			if err != nil {
				slog.Error("Couldn't get any record due to error", "Error", err)
				continue
			}

			timeOut := dayRecord.GetInt("totalTimeOut")

			timeFormatted := utils.FormatDuration(timeOut)

			data := struct {
				Date string
				User string
				Time string
			}{
				Date: yesterdayFormatted,
				User: user.GetString("name"),
				Time: timeFormatted,
			}
			var htmlBody bytes.Buffer
			if err = tmpl.Execute(&htmlBody, &data); err != nil {
				slog.Error("Error executing template:", "Error", err)
				continue
			}

			message := &mailer.Message{
				From: mail.Address{
					Address: app.Settings().Meta.SenderAddress,
					Name:    app.Settings().Meta.SenderName,
				},
				To:      []mail.Address{{Address: user.GetString("email")}},
				Subject: fmt.Sprintf("Invisalign Wearing Roundup for %s", yesterdayFormatted),
				HTML:    htmlBody.String(),
			}

			app.NewMailClient().Send(message)
		}
	}
}
