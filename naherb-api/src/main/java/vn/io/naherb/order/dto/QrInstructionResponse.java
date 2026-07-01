package vn.io.naherb.order.dto;

public record QrInstructionResponse(
        String bankName,
        String accountName,
        String accountNumber,
        String qrImageUrl,
        String transferContent) {}
