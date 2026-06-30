export function extractApiErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại.",
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
