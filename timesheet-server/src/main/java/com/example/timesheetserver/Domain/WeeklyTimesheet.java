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

    private String submissionStatus; // "Not Started", "Incomplete", "Complete"

    private String approvalStatus; // “N/A” – not available, “Not Approved”, “Approved”

    private float totalBillingHours; // default: 45

    private float totalCompensatedHours; // default: 45

    private int floatingDayUsed; // maximum of 3

    private int holidayUsed;

    private int vacationDayUsed; // maximum of 3

    private Document document;

    private List<DailyTimesheet> dailyTimesheets;
}
