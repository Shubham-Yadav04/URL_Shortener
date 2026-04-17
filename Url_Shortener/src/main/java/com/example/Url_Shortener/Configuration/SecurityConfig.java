package com.example.Url_Shortener.Configuration;

import com.example.Url_Shortener.Filter.AuthFilter;
import com.example.Url_Shortener.Services.CustomUserDetailService;
import com.example.Url_Shortener.Utils.CustomAuthSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final AuthFilter authFilter;
    private final CustomAuthSuccessHandler authSuccessHandler;
    SecurityConfig(AuthFilter authFilter,CustomAuthSuccessHandler customAuthSuccessHandler){
        this.authFilter=authFilter;
        this.authSuccessHandler=customAuthSuccessHandler;
    }
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests( request->
                        request.requestMatchers("/user/**").permitAll()
                                .anyRequest().permitAll()
                        ).
                addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(AbstractHttpConfigurer::disable)
                .oauth2Login(oauth -> oauth
                        .successHandler(authSuccessHandler)
                )
                .build();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
}
