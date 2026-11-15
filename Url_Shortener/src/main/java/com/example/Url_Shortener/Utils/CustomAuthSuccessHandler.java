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
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.HashSet;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
@Component
public class CustomAuthSuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    @Value("${access_expiry:600}")
    private int accessTokenExpiry;
    @Value("${refresh_expiry:604800}")
    private int refreshTokenExpiry;
    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;
    @Value("${app.cookie.same-site:Lax}")
    private String cookieSameSite;
    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

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
        String provider;
        User user;
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            provider = oauthToken.getAuthorizedClientRegistrationId().toUpperCase();
            var oauthUser = oauthToken.getPrincipal();
            String providerEmail = oauthUser.getAttribute("email");
            if (providerEmail == null || providerEmail.isBlank()) {
                throw new RuntimeException("Email not found from OAuth provider");
            }
            email = providerEmail.trim().toLowerCase(Locale.ROOT);
            String username = oauthUser.getAttribute("name");
            user = userRepository.findCanonicalByEmail(email).orElse(null);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setUsername(username == null || username.isBlank()
                        ? email.substring(0, email.indexOf('@'))
                        : username);
            }
            if (user.getProviders() == null) user.setProviders(new HashSet<>());
            user.getProviders().add(provider);
            userRepository.save(user);
        } else {
            // LOCAL login
            provider = "LOCAL";
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            email = userDetails.getEmail();
            user = userRepository.findById(userDetails.getId()).orElse(null);
            if (user == null) throw new LoginException("login failed");
            if (user.getProviders() == null) user.setProviders(new HashSet<>());
            user.getProviders().add(provider);
            userRepository.save(user);

        }
        handleLogin(response,user);
        response.sendRedirect(frontendUrl + "/dashboard");
    }
    public void handleLogin(HttpServletResponse response, User user) {
            String email = user.getEmail();
            String accessToken = jwtService.generateToken(email, accessTokenExpiry * 1000L);
            String refreshTokenValue = jwtService.generateToken(email, refreshTokenExpiry * 1000L);
            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setToken(refreshTokenValue);
            refreshToken.setUser(user);
            refreshToken.setExpiryDate(Instant.now().plusSeconds(refreshTokenExpiry));
            refreshToken.setRevoked(false);

            refreshTokenRepository.save(refreshToken);
            ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(true)
                    .secure(secureCookie)
                    .path("/")
                    .sameSite(cookieSameSite)
                    .maxAge(accessTokenExpiry)
                    .build();

            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshTokenValue)
                    .httpOnly(true)
                    .secure(secureCookie)
                    .path("/")
                    .sameSite(cookieSameSite)
                    .maxAge(refreshTokenExpiry)
                    .build();

            response.addHeader("Set-Cookie", accessCookie.toString());
            response.addHeader("Set-Cookie", refreshCookie.toString());
    }

    @Transactional
    public void handleLogout(HttpServletResponse response, String refreshTokenValue, String userId) {
        if (refreshTokenValue != null) {
            RefreshToken token = refreshTokenRepository.findByTokenEager(refreshTokenValue);
            if (token != null && token.getUser().getUserId().equals(userId)) {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            }
        }
        response.addHeader("Set-Cookie", expiredCookie("accessToken").toString());
        response.addHeader("Set-Cookie", expiredCookie("refreshToken").toString());
    }

    private ResponseCookie expiredCookie(String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .sameSite(cookieSameSite)
                .maxAge(0)
                .build();
    }

}
