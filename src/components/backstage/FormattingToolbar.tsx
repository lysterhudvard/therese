import React from "react";

const BoldIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
  </svg>
);

const ItalicIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="19" x2="10" y1="4" y2="4" />
    <line x1="14" x2="5" y1="20" y2="20" />
    <line x1="15" x2="9" y1="4" y2="20" />
  </svg>
);

const LinkIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

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
