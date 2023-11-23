package com.example.timesheetserver.Util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class TimeManager {
    public static String getCurrentTime() {
        SimpleDateFormat sdf = new SimpleDateFormat();
        sdf.applyPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
        Date data = new Date();
        return sdf.format(data);
    }
}