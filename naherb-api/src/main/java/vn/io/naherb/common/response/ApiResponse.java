package vn.io.naherb.common.response;

import java.util.Collections;
import java.util.List;

public record ApiResponse<T>(boolean success, String message, T data, List<Object> errors) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "OK", data, Collections.emptyList());
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data, Collections.emptyList());
    }

    public static <T> ApiResponse<T> failure(String message, T data) {
        return new ApiResponse<>(false, message, data, Collections.emptyList());
    }
}
