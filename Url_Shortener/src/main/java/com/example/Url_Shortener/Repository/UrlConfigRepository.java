package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.UrlConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UrlConfigRepository extends JpaRepository<UrlConfig,String> {
}
