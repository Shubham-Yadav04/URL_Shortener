package com.example.Url_Shortener.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticatedUserDTO {

    private String userId;
    private String username;
    private String email;
    private boolean hasPassword;
}
