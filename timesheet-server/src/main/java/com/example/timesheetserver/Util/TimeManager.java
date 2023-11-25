package com.example.timesheetserver.Util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeManager {
    public static String getCurrentTime() {
        LocalDateTime currentTime = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
        return currentTime.format(formatter); //2023-11-22T15:45:30Z
    }

    public static String getWeekEndingOfCurrentWeek() {
        LocalDate currentDate =  LocalDate.now();
        DayOfWeek currentDayOfWeek = currentDate.getDayOfWeek();
        int dayUntilSaturday = DayOfWeek.SATURDAY.getValue() - currentDayOfWeek.getValue();
        LocalDate weekEndingOfCurrentWeek = currentDate.plusDays(dayUntilSaturday);
        return weekEndingOfCurrentWeek.toString(); //e.g. 2023-11-25
    }
}