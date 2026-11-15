package com.example.Url_Shortener.Configuration;

import com.example.Url_Shortener.Filter.AuthFilter;
import com.example.Url_Shortener.Utils.CustomAuthSuccessHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final AuthFilter authFilter;
    private final CustomAuthSuccessHandler authSuccessHandler;
    private final String frontendOrigin;

    SecurityConfig(AuthFilter authFilter,
                   CustomAuthSuccessHandler customAuthSuccessHandler,
                   @Value("${app.frontend-origin:http://localhost:3000}") String frontendOrigin) {
        this.authFilter = authFilter;
        this.authSuccessHandler = customAuthSuccessHandler;
        this.frontendOrigin = frontendOrigin;
    }
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(request -> request
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/user/signup", "/user/login", "/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers("/r/**", "/verify").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(AbstractHttpConfigurer::disable)
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) ->
                                response.sendError(401, "Authentication required"))
                        .accessDeniedHandler((request, response, exception) ->
                                response.sendError(403, "Access denied")))
                .oauth2Login(oauth -> oauth
                        .successHandler(authSuccessHandler)
                )
                .build();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(Arrays.stream(frontendOrigin.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    RestTemplate restTemplate(){
        return  new RestTemplate();
    }
}
