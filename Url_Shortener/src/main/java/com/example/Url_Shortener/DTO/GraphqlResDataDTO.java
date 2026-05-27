package com.example.Url_Shortener.DTO;

import lombok.*;
import org.springframework.web.bind.annotation.BindParam;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GraphqlResDataDTO {

    private AnalyzeIpDTO analyzeIp;
}
