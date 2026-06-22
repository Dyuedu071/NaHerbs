package vn.io.naherb.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    ResponseEntity<ApiError> handleAuthentication(AuthenticationException exception) {
        return response(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng");
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    ResponseEntity<ApiError> handleInvalidRefreshToken(InvalidRefreshTokenException exception) {
        return response(HttpStatus.UNAUTHORIZED, exception.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    ResponseEntity<ApiError> handleConflict(ConflictException exception) {
        return response(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<ApiError> handleNotFound(NotFoundException exception) {
        return response(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fields = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> fields.putIfAbsent(error.getField(), error.getDefaultMessage()));

        ApiError body = new ApiError(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Dữ liệu không hợp lệ",
                fields);
        return ResponseEntity.badRequest().body(body);
    }

    private static ResponseEntity<ApiError> response(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ApiError.of(status.value(), message));
    }
}
