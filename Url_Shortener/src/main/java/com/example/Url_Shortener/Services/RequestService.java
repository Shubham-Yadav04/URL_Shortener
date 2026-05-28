package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.GraphqlRequestDTO;
import com.example.Url_Shortener.DTO.GraphqlResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class RequestService {

    @Value("${GRAPHQL_ENDPOINT}")
    String graphqlEndpoint;
    @Autowired
    RestTemplate restTemplate;
    public String resolveCountry(HttpServletRequest request){
        try{
log.info("the ip address of the user : {}",request.getRemoteAddr());
            String query= """
        query:{
        analyzeIp(ip: "%s"):{
        country
        }
        """.formatted(request.getRemoteAddr());
            GraphqlRequestDTO graphqlRequest= new GraphqlRequestDTO(query);
            GraphqlResponseDTO res= restTemplate.postForObject(graphqlEndpoint,graphqlRequest,
        GraphqlResponseDTO.class);

            if (res == null ||
                    res.getData() == null ||
                    res.getData().getAnalyzeIp() == null ||
                    res.getData().getAnalyzeIp().getCountry() == null ||
                    res.getData().getAnalyzeIp().getCountry().isBlank()) {

                return "NIL";
            }
            return res.getData().getAnalyzeIp().getCountry();
        } catch (RuntimeException e) {
            return "NIL";
        }
    }

    public String resolveDeviceType(HttpServletRequest request){
        String userAgent = request.getHeader("User-Agent");

        String deviceType = "Desktop";

        if (userAgent != null) {

            String ua = userAgent.toLowerCase();

            if (ua.contains("mobile") ||
                    ua.contains("android") ||
                    ua.contains("iphone")) {

                deviceType = "Mobile";
            }
        }
return deviceType;
    }
}
