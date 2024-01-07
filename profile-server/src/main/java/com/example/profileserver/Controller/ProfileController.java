package com.example.profileserver.Controller;


import com.example.profileserver.DAO.ProfileRepository;
import com.example.profileserver.Service.AmazonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.profileserver.Domain.Profile;
import com.example.profileserver.Domain.Contact;
import com.example.profileserver.Service.ProfileService;
import org.springframework.web.multipart.MultipartFile;

import javax.print.attribute.standard.Media;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    ProfileService profileService;
    AmazonClient amazonClient;

    @Autowired
    ProfileController(ProfileService profileService, AmazonClient amazonClient) {
        this.profileService = profileService;
        this.amazonClient = amazonClient;
    }

    @CrossOrigin
    @GetMapping("")
    public ResponseEntity<ApiResponse<?>> getAllProfiles() {
        try {
            List<Profile> data = profileService.getAllProfiles();
            String message = "All profiles fetched successfully";
            ApiResponse<List<Profile>> apiResponse = new ApiResponse<>(message, data);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to fetch profiles";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getProfile(@PathVariable String id) {
        try {
            Optional<Profile> result = profileService.getProfileById(id);
            if(result.isPresent()) {
                Profile data = result.get();
                String message = String.format("Profile of %s fetched successfully", id);
                ApiResponse<Profile> apiResponse = new ApiResponse<>(message, data);
                return ResponseEntity.ok(apiResponse);
            } else {
                String data = "N/A";
                String message = "Profile not found";
                ApiResponse<String> apiResponse = new ApiResponse<>(message, data);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
        } catch (Exception e) {
            e.printStackTrace();
            String message = String.format("Failed to fatch %s's info", id);
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @PostMapping(value = "/create", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<ApiResponse<?>> createProfileFromAuth(@RequestBody String username) {
        try {
            Profile profile = new Profile();
            profile.setName(username);
            Profile data = profileService.createProfile(profile);
            String message = "Profile created successfully";
            ApiResponse<Profile> apiResponse = new ApiResponse<Profile>(message, data);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to create new profile";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> createProfile(@RequestBody Profile profile) {
        try {
            Profile data = profileService.createProfile(profile);
            String message = "Profile created successfully";
            ApiResponse<Profile> apiResponse = new ApiResponse<Profile>(message, data);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to create new profile";
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @PatchMapping(value = "/contact/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> updateContact(@PathVariable String id, @RequestBody Contact contact) {
        try {
            Contact data = profileService.updateContact(id, contact);
            String message = String.format("Update contact for user %s successfully", id);
            ApiResponse<Contact> apiResponse = new ApiResponse<Contact>(message, data);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to update Contact for user" + id;
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> updateProfile(@PathVariable String id, @RequestBody Profile profile) {
        try {
            Profile data = profileService.updateProfile(id, profile);
            String message = String.format("Update profile for user %s successfully", id);
            ApiResponse<Profile> apiResponse = new ApiResponse<Profile>(message, data);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to update Profile for user" + id;
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @CrossOrigin
    @PostMapping(value = "/uploadAvatar")
    private ResponseEntity<ApiResponse<?>> updateAvatar(@RequestParam("profileId") String profileId, @RequestParam("document") MultipartFile document) {
        try {
            String data = amazonClient.uploadAvatar(profileId, document);
            String message = String.format("Upload avatar for user %s successfully", profileId);
            ApiResponse<String> apiResponse = new ApiResponse<>(message, data);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            e.printStackTrace();
            String message = "Failed to upload avatar for user" + profileId;
            ApiResponse<String> apiResponse = constructErrorResponse(message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    private ApiResponse<String> constructErrorResponse(String message) {
        String data = "N/A";
        return new ApiResponse<String>(message, data);
    }

}