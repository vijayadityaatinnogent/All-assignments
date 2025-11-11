package com.ecommerce.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // sets the HTTP status code for this exception to 404 NOT_FOUND
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message); // calls the constructor of the parent RuntimeException class with the given message
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause); // calls the constructor with message and cause
    }
}