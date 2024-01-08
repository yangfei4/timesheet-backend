package com.example.authserver.Controller;

import com.example.authserver.Domain.User;
import com.example.authserver.Feign.ProfileClient;
import com.example.authserver.Requests.LoginRequest;
import com.example.authserver.Security.JwtTokenProvider;
import com.example.authserver.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final ProfileClient profileClient;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    public AuthController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          PasswordEncoder passwordEncoder,
                          ProfileClient profileClient) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.profileClient = profileClient;
    }

    @PostMapping("/signup")
    public ResponseEntity<Object> signup(@RequestBody LoginRequest loginRequest) {
        try {
            String username = loginRequest.getUsername();
            String password = loginRequest.getPassword();
            String role = loginRequest.getRole();
            String email = loginRequest.getEmail();
            logger.info("Right Here!!!!!");
            logger.info("Received loginRequest " + loginRequest.toString());

            // check if the username already exists
            if(userService.existsUserByUsername(username)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");
            }

            // encrypt the password before saving it in db
            String encryptedPassword = passwordEncoder.encode(password);

            // create a new Profile through ProfileClient and get profile_id
            UserProfileRequest userProfileRequest = new UserProfileRequest();
            userProfileRequest.setUsername(username);
            userProfileRequest.setEmail(email);
            String profile_id = profileClient.createProfileFromAuth(userProfileRequest).getBody();

            // create a new user
            User user = new User(username, encryptedPassword, profile_id, role);

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

    @PostMapping("/logout")
    public ResponseEntity<Object> logout() {
        try {
            // For simplicity, you can clear the SecurityContext to "logout" the user
            SecurityContextHolder.clearContext();

            return ResponseEntity.ok("Logout successful");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during logout");
        }
    }
}
