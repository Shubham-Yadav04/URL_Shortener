package com.example.Url_Shortener.ExceptionHandler;

import com.example.Url_Shortener.ExceptionHandler.Exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

@ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<?> UserNotFoundException(UserNotFoundException ex) {
            System.out.println(ex.getMessage());
             return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
        }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> ResourceNotFoundException(ResourceNotFoundException ex) {
        System.out.println(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<?> UserAlreadyExists(UserAlreadyExistsException ex) {
        System.out.println(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public  ResponseEntity<?> generalException(Exception ex){
    return new ResponseEntity<>(ex.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UrlCreationException.class)
    public ResponseEntity<?> handleUrlCreation(UrlCreationException ex) {
        System.out.println(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RedirectionException.class)
    public ResponseEntity<?> handleRedirectException(RedirectionException ex) {
        System.out.println(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
