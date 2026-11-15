package com.example.Url_Shortener.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShortCodeAvailabilityDTO {
    private String shortCode;
    private boolean available;
}
