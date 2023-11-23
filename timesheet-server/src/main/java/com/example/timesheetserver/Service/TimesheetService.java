package com.example.timesheetserver.Service;

import com.example.timesheetserver.Domain.Profile;
import com.example.timesheetserver.Domain.Timesheet;
import com.example.timesheetserver.Domain.WeeklyTimesheet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.stereotype.Service;
import com.example.timesheetserver.DAO.TimesheetRepository;
import com.example.timesheetserver.DAO.ProfileRepository;

import javax.swing.text.html.Option;
import java.sql.Time;
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