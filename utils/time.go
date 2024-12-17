package utils

import (
	"fmt"
	"time"
)

const DefaultDateLayout = "2006-01-02 15:04:05.000Z"

func GetDayRange(day time.Time) (string, string) {
	startOfDay := day.Truncate(24 * time.Hour)
	endOfDay := startOfDay.Add(24 * time.Hour)
	return startOfDay.Format(DefaultDateLayout), endOfDay.Format(DefaultDateLayout)
}

func FormatDuration(ms int) string {
	duration := time.Duration(ms) * time.Millisecond

	hours := duration / time.Hour
	duration -= hours * time.Hour

	minutes := duration / time.Minute
	duration -= minutes * time.Minute

	seconds := duration / time.Second
	duration -= seconds * time.Second

	milliseconds := duration / time.Millisecond

	return fmt.Sprintf("%02d hours, %02d minutes, %02d.%03d seconds", hours, minutes, seconds, milliseconds)
}
