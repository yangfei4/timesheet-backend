package com.example.timesheetserver.Util;

import com.example.timesheetserver.Domain.DailyTimesheet;
import de.jollyday.Holiday;
import de.jollyday.HolidayCalendar;
import de.jollyday.HolidayManager;

import java.text.ParseException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

public class TimeManager {
    public static String getCurrentTime() {
        LocalDateTime currentTime = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
        return currentTime.format(formatter); //2023-11-22T15:45:30Z
    }

    public static String getWeekEndingOfCurrentWeek() {
        LocalDate currentDate = LocalDate.now();
        DayOfWeek currentDayOfWeek = currentDate.getDayOfWeek();
        int dayUntilSaturday = DayOfWeek.SATURDAY.getValue() - currentDayOfWeek.getValue();
        LocalDate weekEndingOfCurrentWeek = currentDate.plusDays(dayUntilSaturday);
        return weekEndingOfCurrentWeek.toString(); //e.g. 2023-11-25
    }

    public static List<DailyTimesheet> setAllDatesByWeekEnding(List<DailyTimesheet> template, String weekEnding) throws DateTimeParseException {
        for(DailyTimesheet dailyTimesheet:template) {
            String date = "";
            List<String> weekdays = Arrays.asList("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
            int index = weekdays.indexOf(dailyTimesheet.getDay());
            if(index != -1) {
                int move = 6 - index;
                date = generateDateByCurrentWeekday(weekEnding, move);
                dailyTimesheet.setDate(date);
                if(isHoliday(date)) {
                    dailyTimesheet.setHoliday(true);
                }
            } else {
                System.out.println("Wrong weekday format");
            }
        }
        return template;
    }

    public static boolean isHoliday(String date) {
        HolidayManager holidayManager = HolidayManager.getInstance(HolidayCalendar.UNITED_STATES);
        Set<Holiday> holidays = holidayManager.getHolidays(2023, "ny");
        for(Holiday holiday: holidays) {
            if(date.equals(String.valueOf(holiday.getDate()))){
                return true;
            }
        }
        return false;
    }

    public static String generateDateByCurrentWeekday(String weekEnding, int move) throws DateTimeParseException {
        LocalDate weekEndingDate = LocalDate.parse(weekEnding);
        LocalDate resultDate = weekEndingDate.minusDays(move);
        return resultDate.toString();
    }

}