package com.example.Url_Shortener.ExceptionHandler.Exceptions;

public class RedirectionException extends RuntimeException{

    public RedirectionException(String message){
        super(message);
    }
}
