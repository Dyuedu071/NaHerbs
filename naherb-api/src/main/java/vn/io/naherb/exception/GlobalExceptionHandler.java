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
import org.springframework.dao.DataIntegrityViolationException;

import lombok.RequiredArgsConstructor;
import vn.io.naherb.security.AuthCookieService;

@RequiredArgsConstructor
@RestControllerAdvice
public class GlobalExceptionHandler {

    private final AuthCookieService authCookieService;

    @ExceptionHandler(AuthenticationException.class)
    ResponseEntity<ApiError> handleAuthentication(AuthenticationException exception) {
        return response(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng");
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    ResponseEntity<ApiError> handleInvalidRefreshToken(InvalidRefreshTokenException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .header(org.springframework.http.HttpHeaders.SET_COOKIE, authCookieService.deleteAccess(), authCookieService.deleteRefresh())
                .body(ApiError.of(HttpStatus.UNAUTHORIZED.value(), exception.getMessage()));
    }

    @ExceptionHandler(ConflictException.class)
    ResponseEntity<ApiError> handleConflict(ConflictException exception) {
        return response(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<ApiError> handleNotFound(NotFoundException exception) {
        return response(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    ResponseEntity<ApiError> handleBadRequest(BadRequestException exception) {
        return response(HttpStatus.BAD_REQUEST, exception.getMessage());
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

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ApiError> handleDataIntegrityViolation(DataIntegrityViolationException exception) {
        String message = exception.getMessage();
        if (message != null) {
            if (message.contains("products_slug_key")) {
                return response(HttpStatus.CONFLICT, "Đường dẫn (slug) sản phẩm đã tồn tại, vui lòng chọn đường dẫn khác");
            }
            if (message.contains("product_skus_sku_code_key")) {
                return response(HttpStatus.CONFLICT, "Mã SKU đã tồn tại, vui lòng chọn mã khác");
            }
            if (message.contains("product_skus_check")) {
                return response(HttpStatus.BAD_REQUEST, "Giá gốc không được nhỏ hơn giá bán");
            }
        }
        return response(HttpStatus.CONFLICT, "Dữ liệu liên kết không hợp lệ hoặc đã tồn tại");
    }

    private static ResponseEntity<ApiError> response(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ApiError.of(status.value(), message));
    }
}
