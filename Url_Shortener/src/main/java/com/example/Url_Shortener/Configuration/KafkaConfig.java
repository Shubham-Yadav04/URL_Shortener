package com.example.Url_Shortener.Configuration;


import com.example.Url_Shortener.DTO.KafkaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

    @Autowired
    KafkaTemplate<String ,KafkaDTO> kafkaTemplate;
    @Bean("db-update")
    public ConcurrentKafkaListenerContainerFactory<String, KafkaDTO> dbUpdateKafkaFactory(
            ConsumerFactory<String, KafkaDTO> consumerFactory) {

        ConcurrentKafkaListenerContainerFactory<String, KafkaDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory);

        // Enable batch consumption
        factory.setBatchListener(true);

        // Manual acknowledgment
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);

        // Optional: concurrency (parallel partitions)
        factory.setConcurrency(3);

        return factory;
    }

    @Bean("redis-update")
    public ConcurrentKafkaListenerContainerFactory<String, KafkaDTO> redisUpdateKafkaFactory(
            ConsumerFactory<String, KafkaDTO> consumerFactory) {

        ConcurrentKafkaListenerContainerFactory<String, KafkaDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory);

        factory.setBatchListener(false); // single message

        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);

        return factory;
    }
}
