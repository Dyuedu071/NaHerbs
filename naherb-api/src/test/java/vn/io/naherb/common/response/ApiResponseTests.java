package vn.io.naherb.common.response;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;
import org.junit.jupiter.api.Test;

class ApiResponseTests {

    @Test
    void okFactoryCreatesSuccessEnvelope() {
        ApiResponse<Map<String, String>> response = ApiResponse.ok(Map.of("status", "UP"));

        assertTrue(response.success());
        assertEquals("OK", response.message());
        assertEquals("UP", response.data().get("status"));
        assertTrue(response.errors().isEmpty());
    }
}
