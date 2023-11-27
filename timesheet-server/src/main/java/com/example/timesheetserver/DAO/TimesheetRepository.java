package com.example.timesheetserver.DAO;

import com.example.timesheetserver.Domain.Timesheet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TimesheetRepository extends MongoRepository<Timesheet, String> {
    // Custom queries by following naming conventions
    List<Timesheet> findByProfile_IdOrderByWeeklyTimesheet_WeekEndingDesc(String id);
    // equivalent to
    // @Query(value = "{'id':  profile.id}", sort = "{'weeklyTimesheet.weekEnding':  -1}")
    // List<Timesheet> findByProfileAndSortByWeekEndingDesc(String id);

    Optional<Timesheet> findByProfile_IdAndWeeklyTimesheet_WeekEnding(String id, String weekEnding);
}
