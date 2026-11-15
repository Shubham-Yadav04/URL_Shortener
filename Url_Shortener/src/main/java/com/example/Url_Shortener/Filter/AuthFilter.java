package com.example.Url_Shortener.Filter;

import com.example.Url_Shortener.Modal.RefreshToken;
import com.example.Url_Shortener.Modal.User;
import com.example.Url_Shortener.Repository.RefreshTokenRepository;
import com.example.Url_Shortener.Services.CustomUserDetailService;
import com.example.Url_Shortener.Services.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@Component
public class AuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
//    private final UserRepository userRepository;
private final  CustomUserDetailService customUserDetailService;
    @Value("${access_expiry:600}")
    private int accessTokenExpiry;

    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;
    @Value("${app.cookie.same-site:Lax}")
    private String cookieSameSite;

    public AuthFilter(JwtService jwtService,
                RefreshTokenRepository refreshTokenRepository,
                   CustomUserDetailService customUserDetailService) {
            this.jwtService = jwtService;
            this.refreshTokenRepository = refreshTokenRepository;
            this.customUserDetailService=customUserDetailService;
        }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return HttpMethod.OPTIONS.matches(request.getMethod())
                || path.equals("/user/signup")
                || path.equals("/user/login")
                || path.startsWith("/oauth2/")
                || path.startsWith("/login/oauth2/")
                || path.startsWith("/r/")
                || (path.equals("/verify") && HttpMethod.POST.matches(request.getMethod()));
    }
        @Override
        protected void doFilterInternal(HttpServletRequest request,
                HttpServletResponse response,
                FilterChain filterChain)
            throws ServletException, IOException {

            String accessToken = null;
            String refreshToken = null;
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
            if (accessToken != null) {
                String email = null;
                try {
                    email = jwtService.extractEmail(accessToken);
                } catch (JwtException | IllegalArgumentException invalidToken) {
                    SecurityContextHolder.clearContext();
                }
                if (email != null) {
                    setAuthentication(email, request);
                    filterChain.doFilter(request, response);
                    return;
                }
            }

            if (refreshToken != null) {
                User verifiedUser=verifyRefreshToken(refreshToken);
                if(verifiedUser!=null) {
                    String newAccessToken = jwtService.generateToken(verifiedUser.getEmail(), accessTokenExpiry * 1000L);
                    ResponseCookie newCookie = ResponseCookie.from("accessToken",newAccessToken)
                            .httpOnly(true)
                            .secure(secureCookie)
                            .path("/")
                            .sameSite(cookieSameSite)
                            .maxAge(accessTokenExpiry)
                            .build();

                    response.addHeader("Set-Cookie", newCookie.toString());
                    setAuthentication(verifiedUser.getEmail(), request);

                    filterChain.doFilter(request, response);
                    return;

                }
            }
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Invalid or expired tokens");
        }
        private void setAuthentication(String email, HttpServletRequest request) {
            UserDetails userDetails =
                    customUserDetailService.loadUserByUsername(email);
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authToken.setDetails(new org.springframework.security.web.authentication.WebAuthenticationDetailsSource()
                    .buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        private User verifyRefreshToken(String token){

                RefreshToken tokenEntity = refreshTokenRepository
                        .findByTokenEager(token);

                if (tokenEntity != null &&
                        !tokenEntity.isRevoked() &&
                        tokenEntity.getExpiryDate() != null &&
                        tokenEntity.getExpiryDate().isAfter(Instant.now())) {
                    return tokenEntity.getUser();
                }
            return null;
        }
}
