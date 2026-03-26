package com.example.Url_Shortener.ExceptionHandler.Exceptions;

import org.springframework.http.HttpStatus;

public class InValidShortCode extends RuntimeException {
    public InValidShortCode(String message) {
        super(message);
    }
}
