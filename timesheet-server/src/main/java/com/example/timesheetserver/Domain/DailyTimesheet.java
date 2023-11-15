package com.example.timesheetserver.Domain;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DailyTimesheet {
    private String day;

    private String date;

    private String startingTime;

    private String endingTime;

    private boolean isFloatingDay;

    private boolean isVacationDay;

    private boolean isHoliday;
}
