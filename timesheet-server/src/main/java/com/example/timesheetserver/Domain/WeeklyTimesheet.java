package com.example.timesheetserver.Domain;

import lombok.Builder;

import java.util.List;

public class WeeklyTimesheet {
    private String weekending;

    private String submissionStatus;

    private String approvalStatus;

    private float totalBillingHours;

    private float totalCompensatedHours;

    private int floatingDayUsed;

    private int holidayUsed;

    private Document document;

    private List<DailyTimesheet> dailyTimesheets;
}
