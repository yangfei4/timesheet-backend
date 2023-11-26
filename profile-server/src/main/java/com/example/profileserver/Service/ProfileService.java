package com.example.profileserver.Service;

import com.example.profileserver.DAO.ProfileRepository;
import com.example.profileserver.Domain.Contact;
import com.example.profileserver.Domain.DailyTimesheet;
import com.example.profileserver.Domain.Profile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {
    final ProfileRepository profileRepository;

    @Autowired //Constructor injection
    ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile createProfile(Profile profile) {
        // add default values for some attributes
        profile.setRemainingFloatingDay(3);
        profile.setRemainingVacationDay(7);
        profile.setProfileAvatar("");
        String[] weekday = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
        List<DailyTimesheet> weeklyTimesheetTemplate = new ArrayList<>();
        for(String day: weekday) {
            DailyTimesheet dailyTimesheet = new DailyTimesheet();
            dailyTimesheet.setDay(day);
            dailyTimesheet.setHoliday(false);
            dailyTimesheet.setFloatingDay(false);
            dailyTimesheet.setVacationDay(false);
            if(day.equals("Sunday") || day.equals("Saturday")) {
                dailyTimesheet.setStartingTime("N/A");
                dailyTimesheet.setEndingTime("N/A");
            }
            else {
                dailyTimesheet.setStartingTime("09:00");
                dailyTimesheet.setEndingTime("18:00");
            }
            weeklyTimesheetTemplate.add(dailyTimesheet);
        }
        profile.setWeeklyTimesheetTemplate(weeklyTimesheetTemplate);
        profileRepository.save(profile);
        return profile;
    }

    public Optional<Profile> getProfileById(String id) {
        return profileRepository.findById(id);
    }

    public Contact updateContact(String id, Contact contact) {
        Optional<Profile> profileToBeUpdated = profileRepository.findById(id);
        profileToBeUpdated.ifPresent(profile -> {
            profile.setContact(contact);
            profileRepository.save(profile);
        });
        return contact;
    }

    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

}
