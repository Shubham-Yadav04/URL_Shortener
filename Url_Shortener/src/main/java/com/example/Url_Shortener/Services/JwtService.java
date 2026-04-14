package com.example.Url_Shortener.Services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${Jwt_Secret}")
    private  String secret;

    private Key generateSecretKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    public String generateToken(String username,int expireTime){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expireTime))

                .signWith(generateSecretKey())
                .compact();
    }

    public String  extractUsername(String token){
        return Jwts.parserBuilder()
                .setSigningKey(generateSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public Claims extractClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(generateSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    private boolean isTokenExpired(String token){
        return  extractClaims(token).getExpiration().before(new Date());
    }

    public  boolean isValidToken(String token,String username){
        final String  tokenUsername= extractUsername(token);
        return tokenUsername.equals(username) && !isTokenExpired(token);
    }
}
