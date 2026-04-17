package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Services.UserService;
import com.example.Url_Shortener.Utils.CustomAuthSuccessHandler;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final CustomAuthSuccessHandler successHandler;
    public UserController(UserService userService,AuthenticationManager authenticationManager,CustomAuthSuccessHandler successHandler) {
        this.userService = userService;
        this.authenticationManager=authenticationManager;
        this.successHandler=successHandler;
    }
    @GetMapping("/health-check")
    public String healthCheck(){
        return "user controllers working";
    }
    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }
    @PostMapping("/signup")
    public void signup(@RequestBody User user, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Create user
        userService.signup(user.getEmail(),user.getPassword());

        //Authenticate immediately (AUTO LOGIN)
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                               user.getEmail(),
                                user.getPassword()
                        )
                );

        // Use same success handler (🔥 important)
        successHandler.onAuthenticationSuccess(request, response, authentication);
    }



    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable String userId,
            @RequestBody User user) {

        return ResponseEntity.ok(userService.updateUser(userId, user));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
