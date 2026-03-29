package com.example.Url_Shortener.Configuration;

import com.example.Url_Shortener.DTO.RedisMappingDTO;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;

import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
@Bean
    RedisTemplate<String,RedisMappingDTO> redisTemplate(RedisConnectionFactory redisConnectionFactory){
    RedisTemplate<String,RedisMappingDTO> template= new RedisTemplate<>();
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(new JacksonJsonRedisSerializer<>(RedisMappingDTO.class));
    template.setConnectionFactory(redisConnectionFactory);
    return template;

}
@Bean
    StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory){
    StringRedisTemplate template= new StringRedisTemplate();
    template.setConnectionFactory(redisConnectionFactory);
    return template;
}

@Bean(name = "analytic")
    RedisTemplate<String ,Object> secondRedisTemplate(RedisConnectionFactory redisConnectionFactory){
    RedisTemplate<String,Object> template= new RedisTemplate<>();
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(new JacksonJsonRedisSerializer<>(Object.class));
    template.setConnectionFactory(redisConnectionFactory);
    return template;
}
}
