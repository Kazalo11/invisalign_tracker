package utils

import "time"

const DefaultDateLayout = "2006-01-02 15:04:05.000Z"

func GetDayRange() (string, string) {
	startOfDay := time.Now().Truncate(24 * time.Hour)
	endOfDay := startOfDay.Add(24 * time.Hour)
	return startOfDay.Format(DefaultDateLayout), endOfDay.Format(DefaultDateLayout)
}
