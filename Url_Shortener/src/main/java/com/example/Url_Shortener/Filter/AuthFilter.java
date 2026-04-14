package com.example.Url_Shortener.Filter;

import com.example.Url_Shortener.Modal.RefreshToken;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.RefreshTokenRepository;
import com.example.Url_Shortener.Repository.UserRepository;
import com.example.Url_Shortener.Services.CustomUserDetailService;
import com.example.Url_Shortener.Services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;

public class AuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
//    private final UserRepository userRepository;
private final  CustomUserDetailService customUserDetilService;
    @Value("${access_expiry}")
    private int accessTokenExpiry;
    @Value("${refresh_expiry}")
    private int refreshTokenExpiry;

    @Value("${backendUrl}")
    private String backendUrl;
    public AuthFilter(JwtService jwtService,
                RefreshTokenRepository refreshTokenRepository,
                   CustomUserDetailService customUserDetailService) {
            this.jwtService = jwtService;
            this.refreshTokenRepository = refreshTokenRepository;
            this.customUserDetilService=customUserDetailService;
        }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/auth");
    }
        @Override
        protected void doFilterInternal(HttpServletRequest request,
                HttpServletResponse response,
                FilterChain filterChain)
            throws ServletException, IOException {

            String accessToken = null;
            String refreshToken = null;
            String username = null;
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("accessToken".equals(cookie.getName())) {
                        accessToken = cookie.getValue();
                    }
                    if ("refreshToken".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                    }
                }
            }
            try{
                if (accessToken != null) {

                    username = jwtService.extractUsername(accessToken);

                    if (username != null &&
                            SecurityContextHolder.getContext().getAuthentication() == null &&
                            jwtService.isValidToken(accessToken, username)) {

                        setAuthentication(username, request);
                        filterChain.doFilter(request, response);
                        return;
                    }
                    else {
                        throw  new RuntimeException("unauthorized ");
                    }
                }

            } catch (RuntimeException e) {
                System.out.println(e.getMessage());
            }
            if (refreshToken != null) {

                RefreshToken tokenEntity = refreshTokenRepository
                        .findById(refreshToken)
                        .orElse(null);

                if (tokenEntity != null &&
                        !tokenEntity.isRevoked() &&
                        tokenEntity.getExpiryDate().isAfter(LocalDateTime.now())) {

                    User user = tokenEntity.getUser();
                    username = user.getUsername();
                    String newAccessToken = jwtService.generateToken(username,10*60);
                    ResponseCookie newCookie =  ResponseCookie.from("accessToken")
                            .value(newAccessToken)
                            .domain(backendUrl)
                            .httpOnly(true)
                            .maxAge(10*60)
                            .secure(true)
                            .sameSite("none")
                            .build();

                    response.setHeader("Set-Cookie",newCookie.toString());
                    setAuthentication(username, request);

                    filterChain.doFilter(request, response);
                    return;
                }
            }
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Unauthorized: Invalid or expired tokens");
        }
        private void setAuthentication(String username, HttpServletRequest request) {
            UserDetails userDetails =
                    customUserDetilService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authToken.setDetails(request);
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
}