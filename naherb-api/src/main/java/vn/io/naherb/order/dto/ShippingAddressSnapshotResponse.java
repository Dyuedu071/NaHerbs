package vn.io.naherb.order.dto;

public record ShippingAddressSnapshotResponse(
        String receiverName,
        String receiverPhone,
        String email,
        String provinceCity,
        String wardCommune,
        String addressDetail,
        String note,
        String fullAddress) {}
