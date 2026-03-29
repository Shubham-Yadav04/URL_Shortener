package com.example.Url_Shortener.Services;

import com.example.Url_Shortener.DTO.KafkaDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedirectProducer {

    private final KafkaTemplate<String, KafkaDTO> kafkaTemplate;

    RedirectProducer(KafkaTemplate<String , KafkaDTO> kafkaTemplate){
        this.kafkaTemplate=kafkaTemplate;
    }

    public void produceRedirect(KafkaDTO kafkaDTO){
        kafkaTemplate.send("redirectEvent",kafkaDTO);
    }
}
