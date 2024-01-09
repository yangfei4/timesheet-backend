package com.example.authserver.Feign;

import com.example.authserver.Controller.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "timesheet-server")
public interface TimesheetClient {

    @PostMapping("/timesheet/generateTimesheetCurweek/{profile_id}")
    public ResponseEntity<ApiResponse<?>> generateTimesheetCurweek(@PathVariable String profile_id);
}
