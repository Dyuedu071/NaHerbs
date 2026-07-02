"use client";

import {
  type FaqEntryForm,
  createEmptyFaqEntry,
  faqEntriesToForm,
  formEntriesToFaq,
  parseKeywords,
  truncateText,
} from "@/lib/admin-faq";
import {
  getGetAdminChatbotConfigQueryKey,
  useGetAdminChatbotConfig,
  usePutAdminChatbotConfig,
} from "@/services/generated/admin-chatbot/admin-chatbot";
import type { UpdateChatbotConfigRequest } from "@/services/generated/model/updateChatbotConfigRequest";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCsrfToken } from "@/services/csrf";

interface FaqModalState {
  mode: "create" | "edit";
  entry: FaqEntryForm;
}

function FaqFormModal({
  modal,
  onClose,
  onSave,
}: {
  modal: FaqModalState;
  onClose: () => void;
  onSave: (entry: FaqEntryForm) => void;
}) {
  const [draft, setDraft] = useState(modal.entry);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(modal.entry);
    setError(null);
  }, [modal]);

  const handleSubmit = () => {
    const question = draft.question.trim();
    const answer = draft.answer.trim();

    if (!question || !answer) {
      setError("Vui lòng nhập đầy đủ câu hỏi và câu trả lời.");
      return;
    }

    onSave({
      ...draft,
      question,
      answer,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-gutter">
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-herbal-beige bg-surface-container-lowest shadow-ambient-md"
      >
        <div className="flex items-center justify-between border-b border-border-warm px-md py-sm">
          <h2 className="font-headline-md text-headline-md text-primary">
            {modal.mode === "create" ? "Thêm FAQ" : "Sửa FAQ"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-muted transition-colors hover:bg-surface-container hover:text-text-main"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-sm overflow-y-auto px-md py-md">
          <div className="flex flex-col gap-xs">
            <label htmlFor="faq-modal-question" className="font-label-md text-label-md text-text-main">
              Câu hỏi
            </label>
            <textarea
              id="faq-modal-question"
              rows={2}
              value={draft.question}
              onChange={(event) => setDraft((prev) => ({ ...prev, question: event.target.value }))}
              className="rounded-xl border border-border-warm bg-surface px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="NaHerbs có giao hàng toàn quốc không?"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="faq-modal-answer" className="font-label-md text-label-md text-text-main">
              Câu trả lời
            </label>
            <textarea
              id="faq-modal-answer"
              rows={5}
              value={draft.answer}
              onChange={(event) => setDraft((prev) => ({ ...prev, answer: event.target.value }))}
              className="rounded-xl border border-border-warm bg-surface px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Có, NaHerbs giao hàng toàn quốc..."
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="faq-modal-keywords" className="font-label-md text-label-md text-text-main">
              Từ khóa gợi ý (tùy chọn)
            </label>
            <input
              id="faq-modal-keywords"
              type="text"
              value={draft.keywordsText}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, keywordsText: event.target.value }))
              }
              className="rounded-xl border border-border-warm bg-surface px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="giao hàng, ship, vận chuyển"
            />
            <p className="font-caption text-caption text-text-muted">
              Cách nhau bằng dấu phẩy. Giúp chatbot nhận diện câu hỏi tương tự.
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-error-container px-sm py-2 font-caption text-caption text-error">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-sm border-t border-border-warm px-md py-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border-warm px-md py-sm font-label-md text-label-md text-text-main transition-colors hover:bg-surface-container"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-primary px-md py-sm font-label-md text-label-md text-on-primary transition-colors hover:bg-secondary"
          >
            {modal.mode === "create" ? "Thêm" : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminFaqManager() {
  const queryClient = useQueryClient();
  const [entries, setEntries] = useState<FaqEntryForm[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<FaqModalState | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data: configResponse, isLoading, isError } = useGetAdminChatbotConfig();

  useEffect(() => {
    void getCsrfToken();
  }, []);

  useEffect(() => {
    const config = configResponse?.data as { faqEntries?: Parameters<typeof faqEntriesToForm>[0] };
    if (!config) {
      return;
    }
    setEntries(faqEntriesToForm(config.faqEntries ?? []));
    setIsDirty(false);
  }, [configResponse]);

  const { mutate: saveFaq, isPending: isSaving } = usePutAdminChatbotConfig({
    mutation: {
      onSuccess: () => {
        setSaveError(null);
        setSaveMessage("Đã lưu FAQ chatbot.");
        setIsDirty(false);
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
          typeof (error as { response?: { data?: { message?: string } } }).response?.data
            ?.message === "string"
            ? (error as { response: { data: { message: string } } }).response.data.message
            : "Không thể lưu FAQ. Vui lòng thử lại.";
        setSaveError(message);
      },
    },
  });

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return entries;
    }
    return entries.filter((entry) => {
      const keywords = parseKeywords(entry.keywordsText).join(" ");
      return (
        entry.question.toLowerCase().includes(query) ||
        entry.answer.toLowerCase().includes(query) ||
        keywords.toLowerCase().includes(query)
      );
    });
  }, [entries, searchQuery]);

  const handleSaveAll = () => {
    setSaveMessage(null);
    setSaveError(null);

    const { faqEntries, error } = formEntriesToFaq(entries);
    if (error) {
      setSaveError(error);
      return;
    }

    saveFaq({ data: { faqEntries } as UpdateChatbotConfigRequest });
  };

  const handleModalSave = (entry: FaqEntryForm) => {
    setIsDirty(true);
    setSaveMessage(null);
    if (modal?.mode === "create") {
      setEntries((prev) => [...prev, entry]);
      return;
    }
    setEntries((prev) => prev.map((item) => (item.id === entry.id ? entry : item)));
  };

  const handleDelete = (id: string) => {
    const target = entries.find((entry) => entry.id === id);
    if (!target) {
      return;
    }
    const confirmed = window.confirm(`Xóa FAQ "${truncateText(target.question, 60)}"?`);
    if (!confirmed) {
      return;
    }
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    setIsDirty(true);
    setSaveMessage(null);
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-md p-gutter">
        <p className="text-body-md text-text-muted">Đang tải FAQ...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-md p-gutter">
        <p className="text-body-md text-error">
          Không thể tải FAQ. Hãy đăng nhập bằng tài khoản admin.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-lg p-gutter">
      <div className="flex flex-wrap items-end justify-between gap-md">
        <div>
          <Link
            href="/admin/chatbot"
            className="mb-sm inline-flex items-center gap-xs font-caption text-caption text-text-muted transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Cấu hình Chatbot
          </Link>
          <h1 className="mb-xs font-headline-md text-headline-md text-primary">FAQ Chatbot</h1>
          <p className="font-body-md text-body-md text-text-muted">
            Quản lý câu hỏi thường gặp. Câu khớp FAQ sẽ trả lời ngay, không gọi OpenAI.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <button
            type="button"
            onClick={() => setModal({ mode: "create", entry: createEmptyFaqEntry() })}
            className="flex items-center gap-xs rounded-full border border-primary px-md py-sm font-label-md text-label-md text-primary transition-colors hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Thêm FAQ
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving || !isDirty}
            className="rounded-full bg-primary px-md py-sm font-label-md text-label-md text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border-warm bg-surface-container-lowest p-sm shadow-ambient-sm">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Tìm theo câu hỏi, câu trả lời hoặc từ khóa..."
            className="w-full rounded-lg border border-border-warm bg-surface py-2.5 pl-10 pr-4 font-body-md text-body-md outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
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
      {isDirty && (
        <p className="rounded-lg bg-surface-container px-sm py-2 font-caption text-caption text-text-muted">
          Bạn có thay đổi chưa lưu. Nhấn &quot;Lưu thay đổi&quot; để áp dụng lên chatbot.
        </p>
      )}

      <div className="overflow-hidden rounded-[24px] border border-herbal-beige bg-surface-container-lowest shadow-ambient-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-warm bg-surface-container-low">
                <th className="w-12 p-sm font-label-md text-label-md text-text-muted">#</th>
                <th className="p-sm font-label-md text-label-md text-text-muted">Câu hỏi</th>
                <th className="hidden p-sm font-label-md text-label-md text-text-muted md:table-cell">
                  Câu trả lời
                </th>
                <th className="w-28 p-sm font-label-md text-label-md text-text-muted">Từ khóa</th>
                <th className="w-32 p-sm text-center font-label-md text-label-md text-text-muted">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-warm">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-lg text-center font-body-md text-body-md text-text-muted">
                    {entries.length === 0
                      ? "Chưa có FAQ nào. Nhấn \"Thêm FAQ\" để bắt đầu."
                      : "Không tìm thấy FAQ phù hợp."}
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, index) => {
                  const keywordCount = parseKeywords(entry.keywordsText).length;
                  return (
                    <tr key={entry.id} className="hover:bg-surface-container/40">
                      <td className="p-sm font-body-md text-body-md text-text-muted">{index + 1}</td>
                      <td className="p-sm font-body-md text-body-md text-text-main">
                        {entry.question}
                      </td>
                      <td className="hidden p-sm font-body-md text-body-md text-text-muted md:table-cell">
                        {truncateText(entry.answer, 100)}
                      </td>
                      <td className="p-sm font-caption text-caption text-text-muted">
                        {keywordCount > 0 ? `${keywordCount} từ` : "—"}
                      </td>
                      <td className="p-sm">
                        <div className="flex items-center justify-center gap-xs">
                          <button
                            type="button"
                            onClick={() => setModal({ mode: "edit", entry })}
                            className="rounded-lg px-2 py-1 font-caption text-caption text-primary transition-colors hover:bg-primary-container"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id)}
                            className="rounded-lg px-2 py-1 font-caption text-caption text-error transition-colors hover:bg-error-container"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-caption text-caption text-text-muted">
        Tổng cộng {entries.length} FAQ
        {searchQuery.trim() ? ` · Hiển thị ${filteredEntries.length} kết quả` : ""}
      </p>

      {modal && (
        <FaqFormModal
          modal={modal}
          onClose={() => setModal(null)}
          onSave={handleModalSave}
        />
      )}
    </main>
  );
}
