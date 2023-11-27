package com.example.timesheetserver.Domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Timesheet {
    @Id
    private String id;

    @DBRef
    private Profile profile;

    private WeeklyTimesheet weeklyTimesheet;
}
