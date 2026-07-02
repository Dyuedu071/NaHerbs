"use client";

import type { AdminChatbotConfigUpdate } from "@/lib/admin-faq";
import AdminKnowledgePanel from "@/components/admin/AdminKnowledgePanel";
import {
  getGetAdminChatbotConfigQueryKey,
  useGetAdminChatbotConfig,
  usePutAdminChatbotConfig,
} from "@/services/generated/admin-chatbot/admin-chatbot";
import type { UpdateChatbotConfigRequest } from "@/services/generated/model/updateChatbotConfigRequest";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getCsrfToken } from "@/services/csrf";

interface ChatbotConfigForm extends AdminChatbotConfigUpdate {
  suggestedQuestionsText: string;
}

const defaultForm: ChatbotConfigForm = {
  enabled: true,
  welcomeMessage: "",
  disclaimer: "",
  fallbackMessage: "",
  suggestedQuestions: [],
  suggestedQuestionsText: "",
  maxProductsPerAnswer: 3,
};

function parseSuggestedQuestions(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function AdminChatbotConfigPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ChatbotConfigForm>(defaultForm);
  const [faqCount, setFaqCount] = useState(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: configResponse, isLoading, isError } = useGetAdminChatbotConfig();

  useEffect(() => {
    void getCsrfToken();
  }, []);

  const { mutate: saveConfig, isPending: isSaving } = usePutAdminChatbotConfig({
    mutation: {
      onSuccess: () => {
        setSaveError(null);
        setSaveMessage("Đã lưu cấu hình chatbot.");
        void queryClient.invalidateQueries({
          queryKey: getGetAdminChatbotConfigQueryKey(),
        });
      },
      onError: (error: unknown) => {
        setSaveMessage(null);
        const message =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message === "string"
            ? (error as { response: { data: { message: string } } }).response.data
                .message
            : "Không thể lưu cấu hình. Vui lòng thử lại.";
        setSaveError(message);
      },
    },
  });

  useEffect(() => {
    const config = configResponse?.data as AdminChatbotConfigUpdate & {
      faqEntries?: unknown[];
    };
    if (!config) {
      return;
    }
    setForm({
      enabled: config.enabled ?? true,
      welcomeMessage: config.welcomeMessage ?? "",
      disclaimer: config.disclaimer ?? "",
      fallbackMessage: config.fallbackMessage ?? "",
      suggestedQuestions: config.suggestedQuestions ?? [],
      suggestedQuestionsText: (config.suggestedQuestions ?? []).join("\n"),
      maxProductsPerAnswer: config.maxProductsPerAnswer ?? 3,
    });
    setFaqCount(config.faqEntries?.length ?? 0);
  }, [configResponse]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaveMessage(null);
    setSaveError(null);

    const payload: AdminChatbotConfigUpdate = {
      enabled: form.enabled,
      welcomeMessage: form.welcomeMessage?.trim(),
      disclaimer: form.disclaimer?.trim(),
      fallbackMessage: form.fallbackMessage?.trim(),
      suggestedQuestions: parseSuggestedQuestions(form.suggestedQuestionsText),
      maxProductsPerAnswer: form.maxProductsPerAnswer,
    };

    saveConfig({ data: payload as UpdateChatbotConfigRequest });
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-md p-gutter">
        <p className="text-body-md text-text-muted">Đang tải cấu hình chatbot...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-md p-gutter">
        <p className="text-body-md text-error">
          Không thể tải cấu hình. Hãy đăng nhập bằng tài khoản admin.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-lg p-gutter">
      <div>
        <h1 className="mb-xs font-headline-md text-headline-md text-primary">
          Cấu hình Chatbot AI
        </h1>
        <p className="font-body-md text-body-md text-text-muted">
          Quản lý tin nhắn chào mừng, disclaimer và câu hỏi gợi ý trên widget tư vấn.
        </p>
      </div>

      <Link
        href="/admin/chatbot/faq"
        className="flex items-center justify-between gap-md rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md shadow-ambient-sm transition-colors hover:border-primary/40 hover:bg-primary-container/10"
      >
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-2xl text-primary">quiz</span>
          <div>
            <p className="font-label-md text-label-md text-text-main">FAQ Chatbot</p>
            <p className="font-caption text-caption text-text-muted">
              {faqCount > 0
                ? `Đang có ${faqCount} câu hỏi thường gặp`
                : "Chưa có FAQ — thêm câu hỏi trả lời nhanh không qua AI"}
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-text-muted">chevron_right</span>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-md rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md shadow-ambient-sm"
      >
        <label className="flex cursor-pointer items-center gap-sm">
          <input
            type="checkbox"
            checked={form.enabled ?? false}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, enabled: event.target.checked }))
            }
            className="h-5 w-5 rounded border-border-warm text-primary focus:ring-primary"
          />
          <span className="font-label-md text-label-md text-text-main">
            Bật chatbot trên website
          </span>
        </label>

        <div className="flex flex-col gap-xs">
          <label
            htmlFor="welcomeMessage"
            className="font-label-md text-label-md text-text-main"
          >
            Tin nhắn chào mừng
          </label>
          <textarea
            id="welcomeMessage"
            rows={3}
            value={form.welcomeMessage ?? ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, welcomeMessage: event.target.value }))
            }
            className="rounded-xl border border-border-warm bg-surface px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Xin chào! Tôi là trợ lý AI của NaHerbs..."
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label
            htmlFor="disclaimer"
            className="font-label-md text-label-md text-text-main"
          >
            Disclaimer (hiển thị dưới khung chat)
          </label>
          <textarea
            id="disclaimer"
            rows={2}
            value={form.disclaimer ?? ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, disclaimer: event.target.value }))
            }
            className="rounded-xl border border-border-warm bg-surface px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label
            htmlFor="fallbackMessage"
            className="font-label-md text-label-md text-text-main"
          >
            Tin nhắn fallback (khi AI không trả lời được)
          </label>
          <textarea
            id="fallbackMessage"
            rows={2}
            value={form.fallbackMessage ?? ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, fallbackMessage: event.target.value }))
            }
            className="rounded-xl border border-border-warm bg-surface px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label
            htmlFor="maxProductsPerAnswer"
            className="font-label-md text-label-md text-text-main"
          >
            Số sản phẩm gợi ý tối đa mỗi câu trả lời (1–5)
          </label>
          <input
            id="maxProductsPerAnswer"
            type="number"
            min={1}
            max={5}
            value={form.maxProductsPerAnswer ?? 3}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                maxProductsPerAnswer: Number(event.target.value),
              }))
            }
            className="w-32 rounded-xl border border-border-warm bg-surface px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label
            htmlFor="suggestedQuestions"
            className="font-label-md text-label-md text-text-main"
          >
            Câu hỏi gợi ý (mỗi dòng một câu)
          </label>
          <textarea
            id="suggestedQuestions"
            rows={5}
            value={form.suggestedQuestionsText}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                suggestedQuestionsText: event.target.value,
              }))
            }
            className="rounded-xl border border-border-warm bg-surface px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder={"Gối công thái học có mấy phiên bản?\nNaHerbs có giá trị 4R là gì?"}
          />
        </div>

        {saveMessage && (
          <p className="rounded-lg bg-success-bg px-sm py-2 font-caption text-caption text-primary">
            {saveMessage}
          </p>
        )}
        {saveError && (
          <p className="rounded-lg bg-error-container px-sm py-2 font-caption text-caption text-error">
            {saveError}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-primary px-md py-sm font-label-md text-label-md text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
          </button>
        </div>
      </form>

      <AdminKnowledgePanel />
    </main>
  );
}
