package com.example.Url_Shortener.ExceptionHandler.Exceptions;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message){ super(message);}
}
