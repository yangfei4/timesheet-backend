package com.example.authserver.Feign;

import com.example.authserver.Controller.ApiResponse;
import com.example.authserver.Controller.UserProfileRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "profile-server")
public interface ProfileClient {

    @PostMapping("/profile/create")
    public ResponseEntity<String> createProfileFromAuth(@RequestBody UserProfileRequest userProfileRequest);
}
