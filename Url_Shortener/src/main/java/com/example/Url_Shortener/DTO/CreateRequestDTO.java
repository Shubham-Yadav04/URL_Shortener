package com.example.Url_Shortener.DTO;

import lombok.*;

import java.net.URL;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CreateRequestDTO {

private Boolean protectedURL=false;
    private String password;
    private String shortCode;
    private String longURL;
}
