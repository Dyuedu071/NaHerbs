package vn.io.naherb.chatbot;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import vn.io.naherb.chatbot.dto.AdminChatbotConfigResponse;
import vn.io.naherb.chatbot.dto.KnowledgeDocumentSummaryResponse;
import vn.io.naherb.chatbot.dto.KnowledgeUploadResponse;
import vn.io.naherb.chatbot.dto.UpdateChatbotConfigRequest;
import vn.io.naherb.chatbot.rag.KnowledgeAdminService;
import vn.io.naherb.common.response.ApiResponse;

@RestController
@RequestMapping("/api/admin/chatbot")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminChatbotController {

    private final ChatbotConfigService chatbotConfigService;
    private final KnowledgeAdminService knowledgeAdminService;

    @GetMapping("/config")
    public ApiResponse<AdminChatbotConfigResponse> getConfig() {
        return ApiResponse.ok(chatbotConfigService.getAdminConfig());
    }

    @PutMapping("/config")
    public ApiResponse<AdminChatbotConfigResponse> updateConfig(
            @Valid @RequestBody UpdateChatbotConfigRequest request) {
        return ApiResponse.ok(chatbotConfigService.updateAdminConfig(request));
    }

    @GetMapping("/knowledge")
    public ApiResponse<List<KnowledgeDocumentSummaryResponse>> listKnowledge() {
        return ApiResponse.ok(knowledgeAdminService.listDocuments());
    }

    @PostMapping(value = "/knowledge", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<KnowledgeUploadResponse> uploadKnowledge(
            @RequestPart("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean replace) {
        return ApiResponse.ok(knowledgeAdminService.upload(file, replace));
    }

    @DeleteMapping("/knowledge")
    public ApiResponse<Void> deleteKnowledgeByPath(@RequestParam String sourcePath) {
        knowledgeAdminService.deleteBySourcePath(sourcePath);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/knowledge/{documentId}")
    public ApiResponse<Void> deleteKnowledgeById(@PathVariable UUID documentId) {
        knowledgeAdminService.deleteById(documentId);
        return ApiResponse.ok(null);
    }
}