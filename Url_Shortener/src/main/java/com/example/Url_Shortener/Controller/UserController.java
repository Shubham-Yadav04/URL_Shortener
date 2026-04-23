package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.AuthenticatedUserDTO;
import com.example.Url_Shortener.DTO.CustomUserDetails;
import com.example.Url_Shortener.DTO.LoginDTO;
import com.example.Url_Shortener.DTO.SignUpDTO;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.UserAlreadyExistsException;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.UserRepository;
import com.example.Url_Shortener.Services.CustomUserDetailService;
import com.example.Url_Shortener.Services.UserService;
import com.example.Url_Shortener.Utils.CustomAuthSuccessHandler;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @GetMapping("/me")
    public ResponseEntity<Object> isAuthenticated(Authentication auth){
            if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        CustomUserDetails user=( CustomUserDetails) auth.getPrincipal();
AuthenticatedUserDTO response=AuthenticatedUserDTO.builder().id(user.getId()).email(user.getEmail()).username(user.getUsername()).build();
        return ResponseEntity.ok(response);
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
    public ResponseEntity<?> signup(@RequestBody SignUpDTO signUpDTO, HttpServletRequest request, HttpServletResponse response) throws  Exception{
        // Create user
        try{
           User user=userService.signup(signUpDTO);
           successHandler.handleLogin(response,user);
         return new ResponseEntity<>("User created ", HttpStatus.CREATED);
        } catch (Exception ex) {

throw  new RuntimeException(ex.getMessage());
        }
    }
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO,HttpServletRequest request,HttpServletResponse response){
        try{
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    loginDTO.getEmail(), loginDTO.getPassword()
                            )
                    );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            successHandler.onAuthenticationSuccess(request, response, authentication);
           return new ResponseEntity<>("authenticated ",HttpStatus.OK);
        } catch (Exception e) {
           return new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
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
