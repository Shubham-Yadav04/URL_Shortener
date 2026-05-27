package com.example.Url_Shortener.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class GraphqlResponseDTO {
   private GraphqlResDataDTO data;
}
