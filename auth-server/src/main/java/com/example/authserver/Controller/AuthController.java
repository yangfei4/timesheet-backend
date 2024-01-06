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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SimpleTimeZone;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<Object> signup(@RequestBody LoginRequest loginRequest) {
        try {
            String username = loginRequest.getUsername();
            String password = loginRequest.getPassword();
            String profile_id = loginRequest.getProfile_id();
            // check if the username already exists
            if(userService.existsUserByUsername(username)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");
            }

            // create a new user
            User user = new User();
            user.setRole("USER");
            user.setProfile_id(profile_id);

            // encrypt the password before saving it in db
            String encryptedPassword = passwordEncoder.encode(password);
            user.setPassword(encryptedPassword);

            // save the user to the db
            userService.saveUser(user);

            // login the user and generate JWT
            Authentication authentication = new UsernamePasswordAuthenticationToken(username, password);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            List<String> roles = user.getRoles();
            String token = jwtTokenProvider.createToken(username, roles);

            // return profile_id and JWT to the client
            Map<Object, Object> model = new HashMap<>();
            model.put("profile_id", profile_id);
            model.put("token", token);

            return ResponseEntity.status(HttpStatus.CREATED).body(model);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during user registration");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest loginRequest) {
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

            String token = jwtTokenProvider.createToken(username, roles);

            // return map(profile_id -> jwt) to client
            Map<Object, Object> model = new HashMap<>();
            model.put("profile_id", profile_id);
            model.put("token", token);

            return ResponseEntity.ok(model);
        }
        catch (BadCredentialsException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

}
