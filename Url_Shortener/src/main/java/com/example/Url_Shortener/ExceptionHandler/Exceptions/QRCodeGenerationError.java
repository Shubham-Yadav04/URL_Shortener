package com.example.Url_Shortener.ExceptionHandler.Exceptions;

public class QRCodeGenerationError extends RuntimeException {
    public QRCodeGenerationError(String message) {
        super(message);
    }
}
