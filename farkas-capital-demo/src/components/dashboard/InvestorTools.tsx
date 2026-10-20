"use client";

import { useState, useTransition } from "react";
import { addNoteAction, toggleTagAction } from "@/app/actions";
import { Icon } from "@/components/ui/Icon";

const SUGGESTED = ["Large ticket", "Follow-on interest", "Customer", "Partner referral", "Priority", "Needs call"];

export function TagEditor({ investorId, tags }: { investorId: string; tags: string[] }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((t) => (
        <button
          key={t}
          disabled={pending}
          onClick={() => start(() => toggleTagAction(investorId, t))}
          className="group inline-flex items-center gap-1 rounded-full bg-lumen-soft px-2.5 py-1 text-[12px] font-medium text-lumen-deep hover:bg-red-soft hover:text-[#c4231a]"
          title="Remove tag"
        >
          {t}
          <Icon name="x" size={11} className="opacity-50 group-hover:opacity-100" />
        </button>
      ))}
      <div className="relative">
        <button onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1 rounded-full border border-dashed border-line px-2.5 py-1 text-[12px] font-medium text-ink-3 hover:border-ink-4 hover:text-ink">
          <Icon name="plus" size={11} /> Tag
        </button>
        {open ? (
          <div className="absolute left-0 top-8 z-20 w-48 rounded-2xl bg-paper p-1.5 shadow-lift ring-hair">
            {SUGGESTED.filter((t) => !tags.includes(t)).map((t) => (
              <button
                key={t}
                disabled={pending}
                onClick={() => {
                  setOpen(false);
                  start(() => toggleTagAction(investorId, t));
                }}
                className="block w-full rounded-xl px-3 py-1.5 text-left text-[13px] hover:bg-ink/[0.05]"
              >
                {t}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function NoteComposer({ investorId }: { investorId: string }) {
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = text;
        setText("");
        start(() => addNoteAction(investorId, t));
      }}
      className="rounded-2xl bg-canvas p-3"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add an internal note… visible to your team only"
        rows={2}
        className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-ink-4"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-ink-4">Notes are audited and never shown to investors.</span>
        <button disabled={pending || !text.trim()} className="rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-white disabled:opacity-40" style={{ color: "#fff" }}>
          {pending ? "Saving…" : "Add note"}
        </button>
      </div>
    </form>
  );
}
