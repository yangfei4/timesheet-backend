package com.example.timesheetserver.DAO;

import com.example.timesheetserver.Domain.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProfileRepository extends MongoRepository<Profile, String> {
}
