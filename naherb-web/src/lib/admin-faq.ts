import type { UpdateChatbotConfigRequest } from "@/services/generated/model/updateChatbotConfigRequest";

export interface ChatbotFaqEntry {
  question: string;
  answer: string;
  keywords?: string[];
}

export type AdminChatbotConfigUpdate = UpdateChatbotConfigRequest & {
  faqEntries?: ChatbotFaqEntry[];
  maxProductsPerAnswer?: number;
};

export interface FaqEntryForm {
  id: string;
  question: string;
  answer: string;
  keywordsText: string;
}

function createId(): string {
  return `faq-${Math.random().toString(36).slice(2, 11)}`;
}

export function createEmptyFaqEntry(): FaqEntryForm {
  return {
    id: createId(),
    question: "",
    answer: "",
    keywordsText: "",
  };
}

export function faqEntriesToForm(entries: ChatbotFaqEntry[]): FaqEntryForm[] {
  return entries.map((entry) => ({
    id: createId(),
    question: entry.question ?? "",
    answer: entry.answer ?? "",
    keywordsText: (entry.keywords ?? []).join(", "),
  }));
}

export function parseKeywords(text: string): string[] {
  return text
    .split(/[,;\n]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function faqEntryFormToApi(entry: FaqEntryForm): ChatbotFaqEntry | null {
  const question = entry.question.trim();
  const answer = entry.answer.trim();
  const keywords = parseKeywords(entry.keywordsText);

  if (!question && !answer && keywords.length === 0) {
    return null;
  }

  if (!question || !answer) {
    return null;
  }

  return {
    question,
    answer,
    keywords: keywords.length > 0 ? keywords : undefined,
  };
}

export function formEntriesToFaq(entries: FaqEntryForm[]): {
  faqEntries: ChatbotFaqEntry[];
  error?: string;
} {
  const faqEntries: ChatbotFaqEntry[] = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const question = entry.question.trim();
    const answer = entry.answer.trim();
    const keywords = parseKeywords(entry.keywordsText);
    const isEmpty = !question && !answer && keywords.length === 0;

    if (isEmpty) {
      continue;
    }

    if (!question || !answer) {
      return {
        faqEntries: [],
        error: `FAQ #${index + 1}: vui lòng nhập đầy đủ câu hỏi và câu trả lời.`,
      };
    }

    faqEntries.push({
      question,
      answer,
      keywords: keywords.length > 0 ? keywords : undefined,
    });
  }

  return { faqEntries };
}

export function truncateText(text: string, maxLength = 80): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength)}…`;
}
