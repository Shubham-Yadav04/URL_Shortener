package com.example.Url_Shortener.ExceptionHandler.Exceptions;

public class UserAlreadyExistsException extends  RuntimeException{

    public UserAlreadyExistsException(String message){
        super(message);
    }
}
