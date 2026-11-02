'use client';

import { useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Lightweight WYSIWYG editor (contentEditable + execCommand) that emits HTML
// (e.g. <ul><li>...</li></ul>). Used for plan "Benefits Bulletpoints".
export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync external value in (initial load / reset) without disturbing the caret
  // while the user is typing (guarded by the innerHTML !== value check).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
    ref.current?.focus();
  }

  const Btn = ({
    cmd,
    arg,
    title,
    children,
  }: {
    cmd: string;
    arg?: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        exec(cmd, arg);
      }}
      className="min-w-[28px] rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-200"
    >
      {children}
    </button>
  );

  const Sep = () => <span className="mx-1 h-5 w-px bg-gray-300" />;

  return (
    <div className="overflow-hidden rounded-md border border-[#22b14c] bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#22b14c] bg-white px-2 py-1">
        <Btn cmd="bold" title="Bold">
          <b>B</b>
        </Btn>
        <Btn cmd="italic" title="Italic">
          <i>I</i>
        </Btn>
        <Btn cmd="underline" title="Underline">
          <u>U</u>
        </Btn>
        <Sep />
        <Btn cmd="formatBlock" arg="P" title="Normal text">
          <span className="text-[#0060f0]">Normal Text</span>
        </Btn>
        <Sep />
        <Btn cmd="justifyLeft" title="Align left">
          <i className="fa fa-align-left" />
        </Btn>
        <Btn cmd="justifyCenter" title="Align center">
          <i className="fa fa-align-center" />
        </Btn>
        <Btn cmd="justifyRight" title="Align right">
          <i className="fa fa-align-right" />
        </Btn>
        <Sep />
        <Btn cmd="insertUnorderedList" title="Bullet list">
          <i className="fa fa-list-ul" />
        </Btn>
        <Btn cmd="insertOrderedList" title="Numbered list">
          <i className="fa fa-list-ol" />
        </Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder || ''}
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        onBlur={() => ref.current && onChange(ref.current.innerHTML)}
        className="min-h-[160px] bg-white px-3 py-2 text-sm leading-relaxed text-gray-700 outline-none [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
      />
    </div>
  );
}
