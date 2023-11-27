package com.example.timesheetserver.Service;

import com.example.timesheetserver.Domain.*;
import com.example.timesheetserver.Util.TimeManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.timesheetserver.DAO.TimesheetRepository;
import com.example.timesheetserver.DAO.ProfileRepository;

import java.sql.Time;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

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
    public void updateTimesheet(String profileId, WeeklyTimesheet updatedWeeklyTimesheet) {
        String weekEnding = updatedWeeklyTimesheet.getWeekEnding();
        Optional<Timesheet> timesheet_opt = timesheetRepository.findByProfile_IdAndWeeklyTimesheet_WeekEnding(profileId, weekEnding);
        Optional<Profile> profile_opt = profileRepository.findById(profileId);
        if(timesheet_opt.isPresent() && profile_opt.isPresent()) {
            Profile profile = profile_opt.get();
            Timesheet timesheet = timesheet_opt.get();

            WeeklyTimesheet oldWeeklyTimesheet = timesheet.getWeeklyTimesheet();

            int remainingFloatingDay = profile.getRemainingFloatingDay();
            int remainingVacationDay = profile.getRemainingVacationDay();

            int updatedFloatingDayUsed = updatedWeeklyTimesheet.getFloatingDayUsed();
            int updatedVacationDayUsed = updatedWeeklyTimesheet.getVacationDayUsed();

            int oldFloatingDayUsed = oldWeeklyTimesheet.getFloatingDayUsed();
            int oldVacationDayUsed = oldWeeklyTimesheet.getVacationDayUsed();

            int diffFloatingDayUsed = updatedFloatingDayUsed - oldFloatingDayUsed;
            int diffVacationDayUsed = updatedVacationDayUsed - oldVacationDayUsed;

            remainingFloatingDay -= diffFloatingDayUsed;
            remainingVacationDay -= diffVacationDayUsed;

            // update remaining floating day and vacation day
            profile.setRemainingFloatingDay(remainingFloatingDay);
            profile.setRemainingVacationDay(remainingVacationDay);
            profileRepository.save(profile);

            // update values of hours/days
            timesheet.getWeeklyTimesheet().setTotalCompensatedHours(updatedWeeklyTimesheet.getTotalCompensatedHours());
            timesheet.getWeeklyTimesheet().setTotalBillingHours(updatedWeeklyTimesheet.getTotalBillingHours());
            timesheet.getWeeklyTimesheet().setFloatingDayUsed(updatedFloatingDayUsed);
            timesheet.getWeeklyTimesheet().setVacationDayUsed(updatedVacationDayUsed);
            timesheet.getWeeklyTimesheet().setHolidayUsed(updatedWeeklyTimesheet.getHolidayUsed());

            // update submission status: "Not Started", "Incomplete", "Complete"
            if(updatedWeeklyTimesheet.getDocument().getUrl() != null && updatedWeeklyTimesheet.getDocument().getType().equals("approved timesheet")) {
                timesheet.getWeeklyTimesheet().setSubmissionStatus("Complete");
            }
            else {
                timesheet.getWeeklyTimesheet().setSubmissionStatus("Incomplete");
            }
            timesheet.getWeeklyTimesheet().setApprovalStatus("Not Approved");

            // approvalStatus should be updated through a http request
            // update document
            timesheet.getWeeklyTimesheet().setDocument(updatedWeeklyTimesheet.getDocument());

            // update: dailyTimesheets
            timesheet.getWeeklyTimesheet().setDailyTimesheets(updatedWeeklyTimesheet.getDailyTimesheets());
            timesheetRepository.save(timesheet);
        }
    }

    public void approveTimesheet(String profileId, String weekEnding) {
        Optional<Timesheet> optional = timesheetRepository.findByProfile_IdAndWeeklyTimesheet_WeekEnding(profileId, weekEnding);
        optional.ifPresent(timesheet -> {
            timesheet.getWeeklyTimesheet().setApprovalStatus("Approved");
            timesheetRepository.save(timesheet);
        });
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
            weeklyTimesheet.setVacationDayUsed(0);
            List<DailyTimesheet> dailyTimesheets = TimeManager.setAllDatesByWeekEnding(template, weekEnding);
            weeklyTimesheet.setDailyTimesheets(dailyTimesheets);

            int holidayUsed = 0;
            for(DailyTimesheet dailyTimesheet: dailyTimesheets) {
                if(dailyTimesheet.isHoliday()) {
                    holidayUsed++;
                }
            }
            weeklyTimesheet.setHolidayUsed(holidayUsed);

            Document document = new Document();
            document.setType("");
            document.setUrl("");
            document.setTitle("");
            document.setUploadedBy(profile.getName());
            document.setUploadedTime("");
            weeklyTimesheet.setDocument(document);
            timesheet.setWeeklyTimesheet(weeklyTimesheet);

            timesheetRepository.save(timesheet);
        }
    }
}