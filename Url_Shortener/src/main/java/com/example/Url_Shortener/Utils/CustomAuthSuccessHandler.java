package com.example.Url_Shortener.Utils;

import com.example.Url_Shortener.DTO.CustomUserDetails;
import com.example.Url_Shortener.ExceptionHandler.Exceptions.LoginException;
import com.example.Url_Shortener.Modal.RefreshToken;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.RefreshTokenRepository;
import com.example.Url_Shortener.Repository.UserRepository;
import com.example.Url_Shortener.Services.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
@Component
public class CustomAuthSuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    public CustomAuthSuccessHandler(UserRepository userRepository,
                                    RefreshTokenRepository refreshTokenRepository,
                                    JwtService jwtService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }
@Transactional
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        String email;
        String username;
        String provider;
        User user;
        try{
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            provider = oauthToken.getAuthorizedClientRegistrationId().toUpperCase();
            var oauthUser = oauthToken.getPrincipal();
            email = oauthUser.getAttribute("email");
            if (email == null) {
                throw new RuntimeException("Email not found from OAuth provider");
            }
            username = oauthUser.getAttribute("name");
            provider=oauthToken.getAuthorizedClientRegistrationId().toUpperCase();
             user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setUsername(username);
            }
            user.getProviders().add(provider);
            userRepository.save(user);
        } else {
            // LOCAL login
            provider = "LOCAL";
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            email = userDetails.getEmail();
            username = userDetails.getUsername();
            user=userRepository.findByEmail(email).orElse(null);
            if(user==null) throw new LoginException("login failed");
            user.getProviders().add(provider);

        }
            response.getWriter().write("hello");
            handleLogin(response,user);
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
public void handleLogin(HttpServletResponse response,User user){
        try {
            String email = user.getEmail();
            String accessToken = jwtService.generateToken(email, 10 * 60);
            String refreshTokenValue = jwtService.generateToken(email, 7 * 24 * 60 * 60);
            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setToken(refreshTokenValue);
            refreshToken.setUser(user);
            refreshToken.setExpiryDate(Instant.now().plusSeconds(7 * 24 * 60 * 60));
            refreshToken.setRevoked(false);

            refreshTokenRepository.save(refreshToken);
            ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .sameSite("None")
                    .maxAge(10 * 60)
                    .build();

            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshTokenValue)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .sameSite("None")
                    .maxAge(7 * 24 * 60 * 60)
                    .build();

            response.addHeader("Set-Cookie", accessCookie.toString());
            response.addHeader("Set-Cookie", refreshCookie.toString());
        } catch (RuntimeException e) {
            throw new RuntimeException("error in token creation ");
        }
}

}
