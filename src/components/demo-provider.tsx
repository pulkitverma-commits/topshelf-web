"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import { INITIAL_FILES, TRACKS, type DemoFile, type Track } from "@/lib/demo-data";

/**
 * Shared, local-only state for every TopShelf demo on the page, so the music,
 * timer and Shelf behave like one app across the hero and the playground.
 */
interface DemoContextValue {
  track: Track;
  trackIndex: number;
  position: number;
  playing: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  seek: (seconds: number) => void;

  timerTotal: number;
  timerLeft: number;
  timerRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  setTimerMinutes: (minutes: number) => void;

  files: DemoFile[];
  moveFile: (id: string, inTray: boolean) => void;
  startFileDrag: (id: string) => (event: DragEvent) => void;
  takeDraggedFile: (event: DragEvent) => string | null;

  joined: boolean;
  toggleJoined: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [music, setMusic] = useState({ playing: false, trackIndex: 0, position: 48 });
  const [timer, setTimer] = useState({ total: 1500, left: 1500, running: false });
  const [files, setFiles] = useState<DemoFile[]>(INITIAL_FILES);
  const [joined, setJoined] = useState(false);
  const dragId = useRef<string | null>(null);

  useEffect(() => {
    if (!music.playing) return;
    const id = window.setInterval(() => {
      setMusic((m) => {
        const t = TRACKS[m.trackIndex];
        if (m.position + 1 >= t.duration) {
          return { ...m, trackIndex: (m.trackIndex + 1) % TRACKS.length, position: 0 };
        }
        return { ...m, position: m.position + 1 };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [music.playing]);

  useEffect(() => {
    if (!timer.running) return;
    const id = window.setInterval(() => {
      setTimer((t) => {
        const left = Math.max(0, t.left - 1);
        return { ...t, left, running: left > 0 };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timer.running]);

  const togglePlay = useCallback(() => setMusic((m) => ({ ...m, playing: !m.playing })), []);
  const nextTrack = useCallback(
    () => setMusic((m) => ({ ...m, trackIndex: (m.trackIndex + 1) % TRACKS.length, position: 0 })),
    [],
  );
  const prevTrack = useCallback(
    () =>
      setMusic((m) =>
        m.position > 5
          ? { ...m, position: 0 }
          : { ...m, trackIndex: (m.trackIndex + TRACKS.length - 1) % TRACKS.length, position: 0 },
      ),
    [],
  );
  const selectTrack = useCallback((i: number) => setMusic((m) => ({ ...m, trackIndex: i, position: 0 })), []);
  const seek = useCallback((s: number) => setMusic((m) => ({ ...m, position: s })), []);

  const toggleTimer = useCallback(
    () =>
      setTimer((t) => (t.left <= 0 ? { ...t, left: t.total, running: true } : { ...t, running: !t.running })),
    [],
  );
  const resetTimer = useCallback(() => setTimer((t) => ({ ...t, left: t.total, running: false })), []);
  const setTimerMinutes = useCallback(
    (min: number) => setTimer({ total: min * 60, left: min * 60, running: false }),
    [],
  );

  const moveFile = useCallback((id: string, inTray: boolean) => {
    setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, inTray } : f)));
    dragId.current = null;
  }, []);
  const startFileDrag = useCallback(
    (id: string) => (event: DragEvent) => {
      dragId.current = id;
      try {
        event.dataTransfer.setData("text/plain", id);
        event.dataTransfer.effectAllowed = "move";
      } catch {
        /* some browsers restrict dataTransfer; the ref fallback still works */
      }
    },
    [],
  );
  const takeDraggedFile = useCallback((event: DragEvent) => {
    let id: string | null = null;
    try {
      id = event.dataTransfer.getData("text/plain") || null;
    } catch {
      id = null;
    }
    const resolved = id && INITIAL_FILES.some((f) => f.id === id) ? id : dragId.current;
    dragId.current = null;
    return resolved;
  }, []);

  const toggleJoined = useCallback(() => setJoined((j) => !j), []);

  const value = useMemo<DemoContextValue>(
    () => ({
      track: TRACKS[music.trackIndex],
      trackIndex: music.trackIndex,
      position: music.position,
      playing: music.playing,
      togglePlay,
      nextTrack,
      prevTrack,
      selectTrack,
      seek,
      timerTotal: timer.total,
      timerLeft: timer.left,
      timerRunning: timer.running,
      toggleTimer,
      resetTimer,
      setTimerMinutes,
      files,
      moveFile,
      startFileDrag,
      takeDraggedFile,
      joined,
      toggleJoined,
    }),
    [music, timer, files, joined, togglePlay, nextTrack, prevTrack, selectTrack, seek, toggleTimer, resetTimer, setTimerMinutes, moveFile, startFileDrag, takeDraggedFile, toggleJoined],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}
