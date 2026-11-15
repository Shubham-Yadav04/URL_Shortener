package com.example.Url_Shortener.ExceptionHandler;

import com.example.Url_Shortener.ExceptionHandler.Exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.access.AccessDeniedException;

import javax.security.auth.login.LoginException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> ResourceNotFoundException(ResourceNotFoundException ex) {
        System.out.println(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<?> UserAlreadyExists(UserAlreadyExistsException ex) {
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleInvalidInput(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
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

    @ExceptionHandler(QRCodeGenerationError.class)
    public ResponseEntity<?> handleQrGenerationError(QRCodeGenerationError ex) {
        System.out.println(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(InValidShortCode.class)
    public ResponseEntity<?> InValidShortCodeError(InValidShortCode ex) {
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ProtectedRoute.class)
    public ResponseEntity<?> handleUnauthorizedError(ProtectedRoute ex) {
        System.out.println(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFound(UserNotFoundException ex){
    return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<?> handleLoginException(com.example.Url_Shortener.ExceptionHandler.Exceptions.LoginException ex){
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.BAD_REQUEST);
    }
}
