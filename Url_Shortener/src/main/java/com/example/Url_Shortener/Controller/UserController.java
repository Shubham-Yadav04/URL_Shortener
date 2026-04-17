package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.CustomUserDetails;
import com.example.Url_Shortener.DTO.SignUpDTO;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.UserRepository;
import com.example.Url_Shortener.Services.CustomUserDetailService;
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
import java.rmi.RemoteException;
import java.util.List;


@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final CustomAuthSuccessHandler successHandler;
    private final CustomUserDetailService customUserDetailService;
    public UserController(UserService userService,AuthenticationManager authenticationManager,CustomAuthSuccessHandler successHandler,CustomUserDetailService customUserDetailService) {
        this.userService = userService;
        this.authenticationManager=authenticationManager;
        this.successHandler=successHandler;
        this.customUserDetailService= customUserDetailService;
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
    public void signup(@RequestBody SignUpDTO user, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Create user
        try{
            userService.signup(user);
            CustomUserDetails customUser= (CustomUserDetails) customUserDetailService.loadUserByUsername(user.getEmail());
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                   user, null
                            )
                    );
            successHandler.onAuthenticationSuccess(request, response, authentication);
        } catch (RuntimeException e) {
            throw new RemoteException(e.getMessage());
        }
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
