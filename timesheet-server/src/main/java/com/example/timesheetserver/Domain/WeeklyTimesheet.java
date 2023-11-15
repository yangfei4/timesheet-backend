package com.example.timesheetserver.Domain;

import lombok.*;

import java.util.List;

@org.springframework.data.mongodb.core.mapping.Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class WeeklyTimesheet {
    private String weekEnding;

    private String submissionStatus;

    private String approvalStatus;

    private float totalBillingHours;

    private float totalCompensatedHours;

    private int floatingDayUsed;

    private int holidayUsed;

    private Document document;

    private List<DailyTimesheet> dailyTimesheets;
}
