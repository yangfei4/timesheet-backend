package com.example.authserver.Requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LoginRequest {
    private String username;
    private String password;
    private String profile_id;
    private String role;
    private String email;
}
