import React from "react";
import { Bold, Italic, Link } from "lucide-react";

interface FormattingToolbarProps {
  textareaId: string;
  value: string;
  onValueChange: (val: string) => void;
}

export function FormattingToolbar({ textareaId, value, onValueChange }: FormattingToolbarProps) {
  const applyFormat = (tagOpen: string, tagClose: string) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newValue =
      text.substring(0, start) +
      tagOpen +
      selectedText +
      tagClose +
      text.substring(end);

    onValueChange(newValue);

    // Refocus and re-select text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
    }, 0);
  };

  const handleLink = () => {
    const url = prompt("Ange URL att länka till (t.ex. /faq eller https://...):");
    if (url === null) return;
    applyFormat(`<a href="${url}">`, "</a>");
  };

  const BoldIcon = Bold as any;
  const ItalicIcon = Italic as any;
  const LinkIcon = Link as any;

  return (
    <div className="flex items-center gap-1.5 p-1 bg-ink/40 border-b-0 border border-bone/10 rounded-t-sm w-fit">
      <button
        type="button"
        onClick={() => applyFormat("<strong>", "</strong>")}
        className="p-1.5 text-bone/60 hover:text-ember hover:bg-bone/5 rounded transition-all cursor-pointer"
        title="Fet text (Bold)"
      >
        <BoldIcon size={12} />
      </button>
      <button
        type="button"
        onClick={() => applyFormat("<em>", "</em>")}
        className="p-1.5 text-bone/60 hover:text-ember hover:bg-bone/5 rounded transition-all cursor-pointer"
        title="Kursiv text (Italic)"
      >
        <ItalicIcon size={12} />
      </button>
      <button
        type="button"
        onClick={handleLink}
        className="p-1.5 text-bone/60 hover:text-ember hover:bg-bone/5 rounded transition-all cursor-pointer"
        title="Lägg till länk (Link)"
      >
        <LinkIcon size={12} />
      </button>
    </div>
  );
}
