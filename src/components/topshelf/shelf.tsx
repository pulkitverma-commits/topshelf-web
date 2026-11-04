"use client";

import { useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDemo } from "@/components/demo-provider";
import type { DemoFile } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { FileIcon } from "./bits";

/** Drop zone listing files on the Shelf. Files can be dragged out or tapped to move. */
export function ShelfTray({ className, emptyLabel = "Drop files here. They'll wait for you." }: { className?: string; emptyLabel?: string }) {
  const { files, moveFile, startFileDrag, takeDraggedFile } = useDemo();
  const [hot, setHot] = useState(false);
  const inTray = files.filter((f) => f.inTray);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        setHot(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        setHot(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setHot(false);
        const id = takeDraggedFile(e);
        if (id) moveFile(id, true);
      }}
      role="group"
      aria-label="Files on the Shelf"
      data-drop="shelf"
      className={cn(
        "flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-auto rounded-2xl border-[1.5px] border-dashed p-2.5 transition-colors duration-200",
        hot ? "border-accent bg-accent/20" : "border-white/25",
        className,
      )}
    >
      {inTray.length === 0 && <p className="m-auto p-2 text-center text-[13px] text-white/60">{emptyLabel}</p>}
      <AnimatePresence initial={false}>
        {inTray.map((f) => (
          <motion.div
            key={f.id}
            layout
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            <button
              type="button"
              draggable
              onDragStart={startFileDrag(f.id)}
              onClick={() => moveFile(f.id, false)}
              aria-label={`Move ${f.name} back to the desktop`}
              className="inline-flex h-11 cursor-grab items-center gap-2 rounded-xl bg-white/10 pl-2 pr-3.5 text-[13px] text-white transition-colors hover:bg-white/[.17] active:cursor-grabbing"
            >
              <FileIcon kind={f.kind} className="h-7 w-[22px]" />
              {f.name}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** A file sitting on the desktop, draggable into the Shelf. */
export function DeskFile({
  file,
  tone = "light",
  onActivate,
}: {
  file: DemoFile;
  tone?: "light" | "ink";
  onActivate?: (file: DemoFile) => void;
}) {
  const { moveFile, startFileDrag } = useDemo();
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
      <button
        type="button"
        draggable
        onDragStart={startFileDrag(file.id)}
        onClick={() => {
          moveFile(file.id, true);
          onActivate?.(file);
        }}
        aria-label={`Add ${file.name} to the Shelf`}
        className={cn(
          "flex cursor-grab flex-col items-center gap-1.5 rounded-lg px-1 py-1.5 leading-tight transition-[background-color,transform] duration-300 ease-spring active:scale-95 active:cursor-grabbing",
          tone === "light"
            ? "min-h-11 w-[46px] justify-center text-[11px] text-ink/85 [text-shadow:0_1px_2px_rgba(255,255,255,.6)] hover:bg-white/35 sm:w-20"
            : "min-h-11 w-[104px] text-[13px] text-ink hover:bg-ink/5",
        )}
      >
        <FileIcon kind={file.kind} className={tone === "light" ? "h-7 w-[22px] sm:h-[42px] sm:w-[34px]" : "h-[54px] w-11"} />
        <span className={cn("max-w-full truncate", tone === "light" && "hidden sm:block")}>{file.name}</span>
      </button>
    </motion.div>
  );
}

/** Returns drop handlers that move a dragged file back to the desktop. */
export function useDesktopDrop() {
  const { moveFile, takeDraggedFile } = useDemo();
  return {
    onDragOver: (e: DragEvent) => e.preventDefault(),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      const id = takeDraggedFile(e);
      if (id) moveFile(id, false);
    },
  };
}
