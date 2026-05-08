package com.example.Url_Shortener.DTO;

import lombok.*;

import java.time.LocalDate;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DailyCountDTO {
    private LocalDate Day;
   private  Long count;
}
