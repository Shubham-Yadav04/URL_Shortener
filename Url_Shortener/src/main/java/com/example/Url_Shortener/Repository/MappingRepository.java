package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.net.URL;
import java.util.Optional;

@Repository
public interface MappingRepository extends JpaRepository<UrlMapping, String> {

    Optional<UrlMapping> findByShortUrl(URL shortUrl);
}
