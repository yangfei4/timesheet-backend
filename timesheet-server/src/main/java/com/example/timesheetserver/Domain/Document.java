package com.example.timesheetserver.Domain;

import lombok.*;

@org.springframework.data.mongodb.core.mapping.Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Document {
    private String type;

    private String url;

    private String title;

    private String uploadedBy;

    private String uploadedTime;
}
