package com.example.Url_Shortener.DTO;

import lombok.*;

import java.net.URL;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CreateRequestDTO {

private Boolean isProtected=false;
    private String password;
    private String shortCode;
    private String longURL;
    private String projectName;
}
