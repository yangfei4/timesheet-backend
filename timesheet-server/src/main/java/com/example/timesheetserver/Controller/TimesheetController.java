package com.example.timesheetserver.Controller;

import com.example.timesheetserver.Domain.DailyTimesheet;
import com.example.timesheetserver.Domain.Timesheet;
import com.example.timesheetserver.Domain.WeeklyTimesheet;
import com.example.timesheetserver.Service.ProfileService;
import com.example.timesheetserver.Service.TimesheetService;
import io.swagger.annotations.Api;
import org.bouncycastle.jcajce.provider.asymmetric.ec.KeyFactorySpi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.util.List;

@RestController
@RequestMapping("/timesheet")
public class TimesheetController {

    ProfileService profileService;
    TimesheetService timesheetService;

    @Autowired
    TimesheetController(ProfileService profileService, TimesheetService timesheetService) {
        this.profileService = profileService;
        this.timesheetService = timesheetService;
    }

    @CrossOrigin
    @PatchMapping("/template/{profile_id}")
    public ResponseEntity<ApiResponse<?>> updatePersonalTemplate(@PathVariable String profile_id, @RequestBody List<DailyTimesheet> template) {
        try {
            profileService.updateWeeklyTimesheetTemplate(profile_id, template);
            String message = "updated weeklyTimesheet template successfully";
            ApiResponse<List<DailyTimesheet>> apiResponse = new ApiResponse<>(message, template);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to update weeklyTimesheet template";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @PatchMapping("/{timesheet_id}")
    public ResponseEntity<ApiResponse<?>> updateWeeklyTimesheet(@PathVariable String timesheet_id, @RequestBody WeeklyTimesheet weeklyTimesheet) {
        try {
            timesheetService.updateWeeklyTimesheet(timesheet_id, weeklyTimesheet);
            String message = String.format("updated weeklyTimesheet for %s successfully", timesheet_id);
            ApiResponse<WeeklyTimesheet> apiResponse = new ApiResponse<>(message, weeklyTimesheet);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to update weeklyTimesheet due to server issue";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    // To be deleted, not used in the final app
    @CrossOrigin
    @PostMapping("")
    public ResponseEntity<ApiResponse<?>> createTimesheet(@RequestBody Timesheet timesheet) {
        try {
            Timesheet data = timesheetService.createTimesheet(timesheet);
            String message = "Created timesheet successfully";
            ApiResponse<Timesheet> apiResponse = new ApiResponse<>(message, data);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to create a timesheet";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    private ApiResponse<String> constructErrorResponse(String message) {
        String data = "N/A";
        return new ApiResponse<String>(message, data);
    }
}