package com.appointware.common;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {
    private final int httpStatus;

    public ApiException(int httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public static ApiException notFound(String message) {
        return new ApiException(404, message);
    }

    public static ApiException badRequest(String message) {
        return new ApiException(400, message);
    }

    public static ApiException forbidden(String message) {
        return new ApiException(403, message);
    }
}
