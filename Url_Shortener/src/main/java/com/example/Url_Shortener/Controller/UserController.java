package com.example.Url_Shortener.Controller;

import com.example.Url_Shortener.DTO.AuthenticatedUserDTO;
import com.example.Url_Shortener.DTO.CustomUserDetails;
import com.example.Url_Shortener.DTO.LoginDTO;
import com.example.Url_Shortener.DTO.PasswordRequestDTO;
import com.example.Url_Shortener.DTO.SignUpDTO;
import com.example.Url_Shortener.DTO.UserProfileUpdateDTO;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Services.UserService;
import com.example.Url_Shortener.Utils.CustomAuthSuccessHandler;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final CustomAuthSuccessHandler successHandler;
    public UserController(UserService userService,
                          AuthenticationManager authenticationManager,
                          CustomAuthSuccessHandler successHandler) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.successHandler = successHandler;
    }
    @GetMapping("/health-check")
    public String healthCheck(){
        return "user controllers working";
    }
    @GetMapping("/me")
    public ResponseEntity<AuthenticatedUserDTO> isAuthenticated(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(toUserDTO(userService.getUserById(user.getId())));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthenticatedUserDTO> signup(@RequestBody SignUpDTO signUpDTO,
                                                        HttpServletResponse response) {
        User user = userService.signup(signUpDTO);
        successHandler.handleLogin(response, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(toUserDTO(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticatedUserDTO> login(@RequestBody LoginDTO loginDTO,
                                                       HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userService.getUserById(userDetails.getId());
        successHandler.handleLogin(response, user);
        return ResponseEntity.ok(toUserDTO(user));
    }

    @PutMapping("/password")
    public ResponseEntity<AuthenticatedUserDTO> setPassword(
            @RequestBody PasswordRequestDTO passwordRequest,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(toUserDTO(
                userService.setPassword(currentUser.getId(), passwordRequest.getPassword())));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal CustomUserDetails user,
                                       HttpServletRequest request,
                                       HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
        successHandler.handleLogout(response, refreshToken, user.getId());
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<AuthenticatedUserDTO> updateUser(
            @PathVariable String userId,
            @RequestBody UserProfileUpdateDTO profile,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (!currentUser.getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("You cannot update another account");
        }
        User changes = new User();
        changes.setUsername(profile.getUsername());
        changes.setEmail(profile.getEmail());
        return ResponseEntity.ok(toUserDTO(userService.updateUser(userId, changes)));
    }

    private AuthenticatedUserDTO toUserDTO(User user) {
        return AuthenticatedUserDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .hasPassword(user.getPassword() != null && !user.getPassword().isBlank())
                .build();
    }
}
