package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.net.URL;
import java.util.List;
import java.util.Optional;

@Repository
public interface MappingRepository extends JpaRepository<UrlMapping, Long> {

    Optional<UrlMapping> findByShortCode(String shortCode);

    List<UrlMapping> findByOwnerUserId(String userId);
}
