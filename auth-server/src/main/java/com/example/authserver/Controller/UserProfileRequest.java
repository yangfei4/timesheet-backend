package com.example.authserver.Controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
// this class is the request body sent from Auth-server
public class UserProfileRequest {
    private String username;
    private String email;
    private String address;
    private String phone;
}
