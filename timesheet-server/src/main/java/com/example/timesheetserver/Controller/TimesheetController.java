package com.example.timesheetserver.Controller;

import com.example.timesheetserver.Domain.DailyTimesheet;
import com.example.timesheetserver.Domain.Timesheet;
import com.example.timesheetserver.Domain.WeeklyTimesheet;
import com.example.timesheetserver.Service.AmazonClient;
import com.example.timesheetserver.Service.ProfileService;
import com.example.timesheetserver.Service.TimesheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/timesheet")
public class TimesheetController {

    ProfileService profileService;
    TimesheetService timesheetService;
    AmazonClient amazonClient;

    @Autowired
    TimesheetController(ProfileService profileService, TimesheetService timesheetService, AmazonClient amazonClient) {
        this.profileService = profileService;
        this.timesheetService = timesheetService;
        this.amazonClient = amazonClient;
    }

    @CrossOrigin
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<?>> getAllTimesheets() {
        try {
            List<Timesheet> data = timesheetService.getAllTimesheets();
            String message = "Fetch all timesheets successfully";
            ApiResponse<List<Timesheet>> apiResponse = new ApiResponse<>(message, data);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to fetch all Timesheets";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @GetMapping("/summary/{profileId}")
    public ResponseEntity<ApiResponse<?>> getAllTimesheetsByProfileId(@PathVariable String profileId) {
        try {
            List<Timesheet> data = timesheetService.getAllTimesheetsByProfileId(profileId);
            String message = String.format("Fetch all timesheets for %s successfully", profileId);
            ApiResponse<List<Timesheet>> apiResponse = new ApiResponse<>(message, data);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to fetch all Timesheets by profile Id";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @GetMapping("/weeklytimesheet")
    public ResponseEntity<ApiResponse<?>> getWeeklyTimesheet(@RequestParam("profileId") String profileId, @RequestParam("weekEnding") String weekEnding) {
        try {
            Optional<Timesheet> timesheet = timesheetService.getTimesheetByProfileIdAndWeekEnding(profileId, weekEnding);
            if(timesheet.isPresent()){
                String message = "Fetch timesheet by profile Id and week ending successfully";
                Timesheet data = timesheet.get();
                ApiResponse<Timesheet> apiResponse = new ApiResponse<>(message, data);
                return ResponseEntity.ok(apiResponse);
            }
            else {
                String message = "Timesheet not found";
                String data = "N/A";
                ApiResponse<String> apiResponse = new ApiResponse<>(message, data);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to get weeklyTimesheet by profile Id and week ending";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @PatchMapping("/template/{profileId}")
    public ResponseEntity<ApiResponse<?>> updatePersonalTemplate(@PathVariable String profileId, @RequestBody List<DailyTimesheet> template) {
        try {
            profileService.updateWeeklyTimesheetTemplate(profileId, template);
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
    @PatchMapping("/{profileId}")
    public ResponseEntity<ApiResponse<?>> updateTimesheet(@PathVariable String profileId, @RequestBody WeeklyTimesheet weeklyTimesheet) {
        try {
            timesheetService.updateTimesheet(profileId, weeklyTimesheet);
            String message = "updated timesheet successfully";
            ApiResponse<WeeklyTimesheet> apiResponse = new ApiResponse<>(message, weeklyTimesheet);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to update timesheet";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @PatchMapping("/uploadDocument")
    public ResponseEntity<ApiResponse<?>> uploadTimesheetDocument(@RequestParam("profileId") String profileId, @RequestParam("weekEnding") String weekEnding, @RequestParam("document") MultipartFile document) {
        try {
            String data = amazonClient.uploadDocument(profileId, weekEnding, document);
            String message = "Upload document to cloud and get url successfully";
            ApiResponse<String> apiResponse = new ApiResponse<>(message, data);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to upload timesheet document";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @PatchMapping("/approveTimesheet")
    public ResponseEntity<ApiResponse<?>> approveTimesheet(@RequestParam("profileId") String profileId, @RequestParam("weekEnding") String weekEnding) {
        try {
            timesheetService.approveTimesheet(profileId, weekEnding);
            String data = "N/A";
            String message = "Approved the timesheet successfully";
            ApiResponse<String> apiResponse = new ApiResponse<>(message, data);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to approve the timesheet";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    /*
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
    */

    // To be deleted, not used in the final app
    /*
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
    */

    private ApiResponse<String> constructErrorResponse(String message) {
        String data = "N/A";
        return new ApiResponse<>(message, data);
    }
}