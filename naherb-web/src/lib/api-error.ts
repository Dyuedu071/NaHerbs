const ERROR_TRANSLATIONS: Record<string, string> = {
  "Quantity exceeds available stock": "Số lượng yêu cầu vượt quá kho hàng hiện có.",
};

export function extractApiErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại.",
): string {
  let message = fallback;
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message === "string"
  ) {
    message = (error as { response: { data: { message: string } } }).response.data.message;
  } else if (error instanceof Error && error.message) {
    message = error.message;
  }
  return ERROR_TRANSLATIONS[message] || message;
}

