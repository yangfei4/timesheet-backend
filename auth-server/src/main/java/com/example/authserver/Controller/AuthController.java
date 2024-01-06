package com.example.authserver.Controller;

import com.example.authserver.Domain.User;
import com.example.authserver.Requests.LoginRequest;
import com.example.authserver.Security.JwtTokenProvider;
import com.example.authserver.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {
    private UserService userService;

    private AuthenticationManager authenticationManager;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest) {
        try {
            String username = loginRequest.getUsername();
            String password = loginRequest.getPassword();

            // encode the password and authenticate!!!
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            // set Authentication in Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = (User) userService.loadUserByUsername(username);
            List<String> roles = user.getRoles();
            String profile_id = user.getProfile_id();

            String token = new JwtTokenProvider().createToken(username, roles);

            // return map(profile_id -> jwt) to client
            Map<Object, Object> model = new HashMap<>();
            model.put("profile_id", profile_id);
            model.put("token", token);

            return ResponseEntity.ok(model);

        }
        catch (BadCredentialsException e) {
            e.printStackTrace();
            String badUserName = loginRequest.getUsername();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

}
