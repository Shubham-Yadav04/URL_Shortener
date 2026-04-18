package com.example.Url_Shortener.ExceptionHandler.Exceptions;

public class UserNotFoundException extends RuntimeException{
     public UserNotFoundException(String message) { super(message); }
}
