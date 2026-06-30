import type { SuggestedAction } from "@/services/generated/model/suggestedAction";
import { SuggestedActionType } from "@/services/generated/model/suggestedActionType";
import Link from "next/link";

interface ChatSuggestedActionsProps {
  actions: SuggestedAction[];
}

function actionIcon(type?: SuggestedAction["type"]): string {
  switch (type) {
    case SuggestedActionType.VIEW_PRODUCT:
      return "shopping_bag";
    case SuggestedActionType.CONTACT_ZALO:
      return "chat";
    case SuggestedActionType.CALL_HOTLINE:
      return "call";
    case SuggestedActionType.CREATE_LEAD:
      return "person_add";
    default:
      return "arrow_forward";
  }
}

function actionHref(action: SuggestedAction): string {
  if (action.url?.trim()) {
    return action.url;
  }
  if (action.type === SuggestedActionType.CALL_HOTLINE) {
    return "tel:19001234";
  }
  return "#";
}

export default function ChatSuggestedActions({ actions }: ChatSuggestedActionsProps) {
  return (
    <div className="flex max-w-[92%] flex-wrap gap-xs">
      {actions.map((action, index) => {
        const label = action.label?.trim() || "Xem thêm";
        const href = actionHref(action);
        const isExternal =
          href.startsWith("http") ||
          href.startsWith("tel:") ||
          action.type === SuggestedActionType.CONTACT_ZALO;

        const className =
          "inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary-container/30 px-sm py-1 font-caption text-caption text-primary transition-colors hover:bg-primary-container/60";

        if (isExternal) {
          return (
            <a
              key={`${action.type}-${index}`}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={className}
            >
              <span className="material-symbols-outlined text-[14px]">
                {actionIcon(action.type)}
              </span>
              {label}
            </a>
          );
        }

        return (
          <Link key={`${action.type}-${index}`} href={href} className={className}>
            <span className="material-symbols-outlined text-[14px]">
              {actionIcon(action.type)}
            </span>
            {label}
          </Link>
        );
      })}
    </div>
  );
}
