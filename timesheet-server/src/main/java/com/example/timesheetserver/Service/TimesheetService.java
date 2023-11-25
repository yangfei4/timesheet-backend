package com.example.timesheetserver.Service;

import com.example.timesheetserver.Domain.*;
import com.example.timesheetserver.Util.TimeManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.timesheetserver.DAO.TimesheetRepository;
import com.example.timesheetserver.DAO.ProfileRepository;

import javax.swing.text.html.Option;
import java.nio.file.WatchKey;
import java.sql.Time;
import java.text.ParseException;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.PrimitiveIterator;

@Service
public class TimesheetService {

    final TimesheetRepository timesheetRepository;
    final ProfileRepository profileRepository;

    @Autowired
    TimesheetService(TimesheetRepository timesheetRepository, ProfileRepository profileRepository) {
        this.timesheetRepository = timesheetRepository;
        this.profileRepository = profileRepository;
    }

    public List<Timesheet> getAllTimesheets() {
        return timesheetRepository.findAll();
    }

    public List<Timesheet> getAllTimesheetsByProfileId(String profileId) {
        return timesheetRepository.findByProfile_IdOrderByWeeklyTimesheet_WeekEndingDesc(profileId);
    }

    public Optional<Timesheet> getTimesheetByProfileIdAndWeekEnding(String profileId, String weekEnding) {
        return timesheetRepository.findByProfile_IdAndWeeklyTimesheet_WeekEnding(profileId, weekEnding);
    }

    public void saveTimesheet(Timesheet timesheet) {
        timesheetRepository.save(timesheet);
    }


    // Update weeklyTimesheet, and update its parent Timesheet accordingly.
    // retrieve weekEnding from requestBody weeklyTimesheet.
    // TODO(Yangfei): implement this method
    public void updateTimesheet(String profileId, WeeklyTimesheet weeklyTimesheet) {
        String weekEnding = weeklyTimesheet.getWeekEnding();
    }

    // Will be called at midnight (0 hours, 0 minutes, 0 seconds) every Sunday
    @Scheduled(cron = "0 0 0 ? * SUN *")
    public void generateTimesheetEverySunday() throws DateTimeParseException {
        List<Profile> profileList = profileRepository.findAll();
        for(Profile profile: profileList) {
            String weekEnding = TimeManager.getWeekEndingOfCurrentWeek(); // e.g. 2023-11-25
            List<DailyTimesheet> template = profile.getWeeklyTimesheetTemplate();
            Timesheet timesheet = new Timesheet();
            timesheet.setProfile(profile);
            WeeklyTimesheet weeklyTimesheet = new WeeklyTimesheet();
            weeklyTimesheet.setWeekEnding(weekEnding);
            weeklyTimesheet.setSubmissionStatus("Not Started");
            weeklyTimesheet.setApprovalStatus("N/A");
            weeklyTimesheet.setTotalBillingHours(45);
            weeklyTimesheet.setTotalCompensatedHours(45);
            weeklyTimesheet.setFloatingDayUsed(0);
            weeklyTimesheet.setHolidayUsed(0);
            weeklyTimesheet.setVacationDayUsed(0);
            weeklyTimesheet.setDailyTimesheets(TimeManager.setAllDatesByWeekEnding(template, weekEnding));
            Document document = new Document();
            document.setType("");
            document.setUrl("");
            document.setTitle("");
            document.setUploadedBy(profile.getName());
            document.setUploadedTime("");
            weeklyTimesheet.setDocument(document);
            timesheet.setWeeklyTimesheet(weeklyTimesheet);

        };
    }

    /*
    // when updating weeklyTimesheet, we need to update its parent Timesheet accordingly. So this
    // method is not applicable in our use case.
    public void updateWeeklyTimesheet(String timesheet_id, WeeklyTimesheet weeklyTimesheet) {
        Optional<Timesheet> optional = timesheetRepository.findById(timesheet_id);
        optional.ifPresent(timesheet -> {
            timesheet.setWeeklyTimesheet(weeklyTimesheet);
            timesheetRepository.save(timesheet);
        });
    }
    */

    /*
    public Timesheet createTimesheet(Timesheet timesheet) {
        timesheetRepository.save(timesheet);
        return timesheet;
    }
    */
}