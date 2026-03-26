package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.Modal.ClickDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClickDetailsRepository  extends JpaRepository<ClickDetails,String> {
}
