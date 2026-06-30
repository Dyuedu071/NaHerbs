"use client";

import {
  getGetAdminChatbotKnowledgeQueryKey,
  useDeleteAdminChatbotKnowledge,
  useGetAdminChatbotKnowledge,
  usePostAdminChatbotKnowledge,
} from "@/services/generated/admin-chatbot/admin-chatbot";
import type { KnowledgeDocumentSummary } from "@/services/generated/model/knowledgeDocumentSummary";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getCsrfToken } from "@/services/csrf";

function formatBytes(bytes?: number | null): string {
  if (bytes == null) {
    return "—";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "—";
  }
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function sourceTypeLabel(sourceType?: KnowledgeDocumentSummary["sourceType"]): string {
  switch (sourceType) {
    case "UPLOAD":
      return "Upload";
    case "SEED":
      return "Seed";
    case "BLOG":
      return "Blog";
    case "PRODUCT":
      return "Sản phẩm";
    default:
      return sourceType ?? "—";
  }
}

function extractErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message;
  }
  return "Có lỗi xảy ra. Vui lòng thử lại.";
}

export default function AdminKnowledgePanel() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const { data: listResponse, isLoading, isError } = useGetAdminChatbotKnowledge();
  const documents = (Array.isArray(listResponse?.data)
    ? listResponse.data
    : []) as KnowledgeDocumentSummary[];

  useEffect(() => {
    void getCsrfToken();
  }, []);

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: getGetAdminChatbotKnowledgeQueryKey() });

  const { mutate: uploadKnowledge, isPending: isUploading } = usePostAdminChatbotKnowledge({
    mutation: {
      onSuccess: () => {
        setFeedback({
          type: "success",
          text: "Upload thành công. Hệ thống đang index file trong nền.",
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        void invalidateList();
      },
      onError: (error) => {
        setFeedback({ type: "error", text: extractErrorMessage(error) });
      },
    },
  });

  const { mutate: deleteKnowledge, isPending: isDeleting } = useDeleteAdminChatbotKnowledge({
    mutation: {
      onSuccess: () => {
        setFeedback({ type: "success", text: "Đã xóa file knowledge." });
        void invalidateList();
      },
      onError: (error) => {
        setFeedback({ type: "error", text: extractErrorMessage(error) });
      },
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFeedback(null);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setFeedback({ type: "error", text: "Vui lòng chọn file .md trước khi upload." });
      return;
    }
    if (!selectedFile.name.toLowerCase().endsWith(".md")) {
      setFeedback({ type: "error", text: "Chỉ chấp nhận file Markdown (.md)." });
      return;
    }

    uploadKnowledge({
      data: { file: selectedFile },
      params: { replace: replaceExisting },
    });
  };

  const handleDelete = (document: KnowledgeDocumentSummary) => {
    if (!document.sourcePath) {
      return;
    }
    const confirmed = window.confirm(
      `Xóa file "${document.fileName}" khỏi knowledge? Chatbot sẽ không còn dùng nội dung này.`,
    );
    if (!confirmed) {
      return;
    }
    deleteKnowledge({ params: { sourcePath: document.sourcePath } });
  };

  return (
    <section className="flex flex-col gap-md rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md shadow-ambient-sm">
      <div>
        <h2 className="mb-xs font-headline-md text-headline-md text-primary">
          Knowledge (Markdown)
        </h2>
        <p className="font-body-md text-body-md text-text-muted">
          Upload file .md vào thư mục chatbot-knowledge. Hệ thống tự lưu file và index để chatbot
          đọc được. Nên dùng text thuần — tránh nhúng ảnh base64 trong file.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border-warm bg-surface p-md">
        <div className="flex flex-col gap-sm md:flex-row md:items-end">
          <div className="flex-1">
            <label
              htmlFor="knowledge-file"
              className="mb-xs block font-label-md text-label-md text-text-main"
            >
              Chọn file Markdown
            </label>
            <input
              id="knowledge-file"
              ref={fileInputRef}
              type="file"
              accept=".md,text/markdown"
              onChange={handleFileChange}
              className="block w-full font-body-md text-body-md text-text-main file:mr-sm file:rounded-full file:border-0 file:bg-primary-container file:px-sm file:py-1 file:font-label-md file:text-primary"
            />
            {selectedFile && (
              <p className="mt-xs font-caption text-caption text-text-muted">
                {selectedFile.name} ({formatBytes(selectedFile.size)})
              </p>
            )}
          </div>

          <label className="flex items-center gap-xs font-caption text-caption text-text-muted">
            <input
              type="checkbox"
              checked={replaceExisting}
              onChange={(event) => setReplaceExisting(event.target.checked)}
              className="h-4 w-4 rounded border-border-warm text-primary focus:ring-primary"
            />
            Ghi đè nếu trùng tên file
          </label>

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="rounded-full bg-primary px-md py-sm font-label-md text-label-md text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {isUploading ? "Đang upload..." : "Upload & index"}
          </button>
        </div>
      </div>

      {feedback && (
        <p
          className={`rounded-lg px-sm py-2 font-caption text-caption ${
            feedback.type === "success"
              ? "bg-success-bg text-primary"
              : "bg-error-container text-error"
          }`}
        >
          {feedback.text}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border-warm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-warm bg-surface-container-low">
                <th className="p-sm font-label-md text-label-md text-text-muted">Tên file</th>
                <th className="p-sm font-label-md text-label-md text-text-muted">Nguồn</th>
                <th className="p-sm font-label-md text-label-md text-text-muted">Chunks</th>
                <th className="p-sm font-label-md text-label-md text-text-muted">Index</th>
                <th className="p-sm font-label-md text-label-md text-text-muted">Kích thước</th>
                <th className="p-sm text-center font-label-md text-label-md text-text-muted">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-warm">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="p-sm font-body-md text-body-md text-text-muted">
                    Đang tải danh sách...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={6} className="p-sm font-body-md text-body-md text-error">
                    Không tải được danh sách knowledge.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && documents.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-sm font-body-md text-body-md text-text-muted">
                    Chưa có file knowledge nào.
                  </td>
                </tr>
              )}
              {documents.map((document) => (
                <tr key={document.sourcePath ?? document.fileName} className="hover:bg-surface/50">
                  <td className="p-sm">
                    <p className="font-body-md text-body-md font-semibold text-text-main">
                      {document.fileName}
                    </p>
                    <p className="truncate font-caption text-caption text-text-muted">
                      {document.title}
                    </p>
                  </td>
                  <td className="p-sm font-body-md text-body-md">
                    {sourceTypeLabel(document.sourceType)}
                  </td>
                  <td className="p-sm font-body-md text-body-md">
                    {document.embeddedChunkCount ?? 0}/{document.chunkCount ?? 0}
                  </td>
                  <td className="p-sm font-caption text-caption text-text-muted">
                    {formatDate(document.indexedAt)}
                  </td>
                  <td className="p-sm font-body-md text-body-md text-text-muted">
                    {formatBytes(document.fileSizeBytes)}
                  </td>
                  <td className="p-sm text-center">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(document)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-error-container/30 hover:text-error"
                      title="Xóa file"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
