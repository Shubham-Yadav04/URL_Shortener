package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken,String> {
 @Query("SELECT rt FROM RefreshToken rt JOIN FETCH rt.user WHERE rt.token = :token")
 RefreshToken findByTokenEager(String token);
}
