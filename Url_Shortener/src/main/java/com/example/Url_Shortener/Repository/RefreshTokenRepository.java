package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken,String> {

}
