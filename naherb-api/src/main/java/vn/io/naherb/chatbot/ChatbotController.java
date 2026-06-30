package vn.io.naherb.chatbot;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.chatbot.dto.ChatbotConversationResponse;
import vn.io.naherb.chatbot.dto.ChatbotMessageRequest;
import vn.io.naherb.chatbot.dto.ChatbotMessageResponse;
import vn.io.naherb.chatbot.dto.CreateConversationRequest;
import vn.io.naherb.chatbot.dto.PublicChatbotConfigResponse;
import vn.io.naherb.common.response.ApiResponse;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotConfigService chatbotConfigService;
    private final ChatbotService chatbotService;

    @GetMapping("/config/public")
    public ApiResponse<PublicChatbotConfigResponse> getPublicConfig() {
        return ApiResponse.ok(chatbotConfigService.getPublicConfig());
    }

    @PostMapping("/conversations")
    public ResponseEntity<ApiResponse<ChatbotConversationResponse>> createConversation(
            @RequestBody(required = false) CreateConversationRequest request,
            @AuthenticationPrincipal JwtAuthenticationToken authentication) {
        CreateConversationRequest payload = request != null ? request : new CreateConversationRequest(null, null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(chatbotService.createConversation(payload, authentication)));
    }

    @PostMapping("/messages")
    public ApiResponse<ChatbotMessageResponse> sendMessage(
            @Valid @RequestBody ChatbotMessageRequest request,
            @AuthenticationPrincipal JwtAuthenticationToken authentication) {
        return ApiResponse.ok(chatbotService.handleMessage(request, authentication));
    }
}
