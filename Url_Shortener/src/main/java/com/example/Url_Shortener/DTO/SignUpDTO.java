package com.example.Url_Shortener.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignUpDTO {
    private String email;
    private String password;
    private String username;

}
