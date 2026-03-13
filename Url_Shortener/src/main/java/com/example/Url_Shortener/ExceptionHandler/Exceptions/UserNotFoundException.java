package com.example.Url_Shortener.ExceptionHandler.Exceptions;

public class UserNotFoundException extends RuntimeException{
     UserNotFoundException(String message) { super(message); }
}
