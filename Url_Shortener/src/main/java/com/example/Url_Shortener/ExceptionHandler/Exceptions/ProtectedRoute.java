package com.example.Url_Shortener.ExceptionHandler.Exceptions;

public class ProtectedRoute extends RuntimeException {
    public ProtectedRoute(String message) {
        super(message);
    }
}
