package com.example.Url_Shortener.Utils;

import com.example.Url_Shortener.Modal.RefreshToken;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.RefreshTokenRepository;
import com.example.Url_Shortener.Repository.UserRepository;
import com.example.Url_Shortener.Services.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

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

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        String email;
        String username;
        String provider;
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {

            provider = oauthToken.getAuthorizedClientRegistrationId().toUpperCase();

            var oauthUser = oauthToken.getPrincipal();

            email = oauthUser.getAttribute("email");
            username = email;

        } else {
            // LOCAL login
            provider = "LOCAL";

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            username = userDetails.getUsername();
            email = username; // assuming email = username
        }
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(username);
            user.setProviders(new HashSet<>());
        }

        Set<String> providers = user.getProviders();
        if (providers == null) {
            providers = new HashSet<>();
        }
        providers.add(provider);
        user.setProviders(providers);

        userRepository.save(user);
        handleLogin(response,username,user);
        response.sendRedirect("http://localhost:3000/home");
    }
private void handleLogin(HttpServletResponse response,String username,User user){
    String accessToken = jwtService.generateToken(username, 10 * 60);

    String refreshTokenValue = jwtService.generateToken(username,7*24*60*60);

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

}

}
