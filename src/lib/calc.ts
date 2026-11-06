/**
 * Calculator engine with the same rules as CalculatorEngine.swift in the app:
 * × ÷ before + −, brackets (unclosed ones close implicitly), ± for negatives,
 * and % as "per cent of": 50 + 10 % → 55, 10 % → 0.1. Up to 15 digits.
 */
export type Token =
  | { t: "num"; s: string }
  | { t: "op"; o: Op }
  | { t: "pct" }
  | { t: "open" }
  | { t: "close" };
export type Op = "+" | "−" | "×" | "÷";
export type CalcError = "div0" | "invalid" | "overflow";
export interface CalcState {
  tokens: Token[];
  justEvaluated: boolean;
  error: CalcError | null;
  history: { expr: string; v: number }[];
}
export type PressResult = "ok" | "equals" | CalcError;

const OPS: Op[] = ["+", "−", "×", "÷"];
const MAX_DIGITS = 15;
export const ERR_TEXT: Record<CalcError, string> = { div0: "Can't divide by zero", invalid: "Incomplete expression", overflow: "Too large" };

export const emptyCalc = (): CalcState => ({ tokens: [], justEvaluated: false, error: null, history: [] });

const groupInt = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export function fmtTyped(s: string) {
  const neg = s.startsWith("-");
  const body = neg ? s.slice(1) : s;
  const [int, dec] = body.split(".");
  return `${neg ? "−" : ""}${groupInt(int || (dec !== undefined ? "0" : ""))}${dec !== undefined ? `.${dec}` : ""}`;
}
export function fmtNum(v: number) {
  if (Object.is(v, -0)) v = 0;
  const a = Math.abs(v);
  if (a !== 0 && a < 1e-9) return v.toExponential(4).replace("-", "−");
  return v.toLocaleString("en-US", { maximumFractionDigits: 10 }).replace("-", "−");
}
const rawOf = (v: number) => String(parseFloat(v.toPrecision(12)));
const isNum = (t?: Token): t is { t: "num"; s: string } => !!t && t.t === "num";

export function exprText(tokens: Token[], closeAll = false) {
  let s = tokens.map((t) => (t.t === "num" ? fmtTyped(t.s) : t.t === "op" ? ` ${t.o} ` : t.t === "pct" ? "%" : t.t === "open" ? "(" : ")")).join("");
  if (closeAll) s += ")".repeat(Math.max(0, tokens.reduce((n, t) => n + (t.t === "open" ? 1 : 0) - (t.t === "close" ? 1 : 0), 0)));
  return s;
}

class Err extends Error {
  constructor(public code: CalcError) {
    super(code);
  }
}

export function evaluate(tokens: Token[]): number {
  let i = 0;
  const peek = () => tokens[i];
  const isMul = (t?: Token) => !!t && t.t === "op" && (t.o === "×" || t.o === "÷");
  const isAdd = (t?: Token) => !!t && t.t === "op" && (t.o === "+" || t.o === "−");
  function primary(): number {
    const tk = peek();
    if (!tk) throw new Err("invalid");
    if (tk.t === "num") {
      if (tk.s === "-" || tk.s === "") throw new Err("invalid");
      i++;
      return parseFloat(tk.s);
    }
    if (tk.t === "open") {
      i++;
      const v = add();
      if (peek()?.t === "close") i++;
      return v;
    }
    throw new Err("invalid");
  }
  function postfix() {
    let v = primary();
    let pct = false;
    while (peek()?.t === "pct") {
      i++;
      if (pct) v /= 100;
      pct = true;
    }
    return { v, pct };
  }
  function mul() {
    const f = postfix();
    if (!isMul(peek())) return f;
    let acc = f.pct ? f.v / 100 : f.v;
    while (isMul(peek())) {
      const o = (peek() as { o: Op }).o;
      i++;
      const g = postfix();
      const gv = g.pct ? g.v / 100 : g.v;
      if (o === "÷") {
        if (gv === 0) throw new Err("div0");
        acc /= gv;
      } else acc *= gv;
    }
    return { v: acc, pct: false };
  }
  function add(): number {
    const f = mul();
    let acc = f.pct ? f.v / 100 : f.v;
    while (isAdd(peek())) {
      const o = (peek() as { o: Op }).o;
      i++;
      const g = mul();
      const gv = g.pct ? (acc * g.v) / 100 : g.v; // x + y% → y% of x
      acc = o === "+" ? acc + gv : acc - gv;
    }
    return acc;
  }
  const v = add();
  if (i < tokens.length) throw new Err("invalid");
  if (!Number.isFinite(v) || Math.abs(v) >= 1e15) throw new Err("overflow");
  return parseFloat(v.toPrecision(12));
}

export function preview(state: CalcState) {
  if (!state.tokens.length) return null;
  try {
    return evaluate(state.tokens);
  } catch {
    return null;
  }
}

/** Applies one key to a copy of the state. Keys: 0–9 . + − × ÷ % ± ( ) ⌫ C = */
export function press(prev: CalcState, k: string): { state: CalcState; result: PressResult } {
  const s: CalcState = { ...prev, tokens: prev.tokens.map((t) => ({ ...t })), history: prev.history, error: null };
  const T = s.tokens;
  const last = () => T[T.length - 1];
  const endsWithValue = () => {
    const l = last();
    return !!l && ((isNum(l) && l.s !== "-") || l.t === "close" || l.t === "pct");
  };
  const openCount = () => T.reduce((n, t) => n + (t.t === "open" ? 1 : 0) - (t.t === "close" ? 1 : 0), 0);
  const resetIfEvaluated = () => {
    if (s.justEvaluated) {
      T.length = 0;
      s.justEvaluated = false;
    }
  };
  if (/^\d$/.test(k)) {
    resetIfEvaluated();
    const l = last();
    if (isNum(l)) {
      if (l.s.replace(/\D/g, "").length >= MAX_DIGITS) return { state: s, result: "ok" };
      l.s = l.s === "0" ? k : l.s === "-0" ? `-${k}` : l.s + k;
    } else {
      if (l && (l.t === "close" || l.t === "pct")) T.push({ t: "op", o: "×" });
      T.push({ t: "num", s: k });
    }
  } else if (k === ".") {
    resetIfEvaluated();
    const l = last();
    if (isNum(l)) {
      if (!l.s.includes(".")) l.s = `${l.s === "-" ? "-0" : l.s}.`;
    } else {
      if (l && (l.t === "close" || l.t === "pct")) T.push({ t: "op", o: "×" });
      T.push({ t: "num", s: "0." });
    }
  } else if ((OPS as string[]).includes(k)) {
    const o = k as Op;
    s.justEvaluated = false;
    const l = last();
    if (!l) {
      if (o === "−") T.push({ t: "num", s: "-" });
      else T.push({ t: "num", s: "0" }, { t: "op", o });
    } else if (l.t === "op") l.o = o;
    else if (l.t === "open") {
      if (o === "−") T.push({ t: "num", s: "-" });
    } else if (isNum(l) && l.s === "-") {
      /* waiting for a digit */
    } else T.push({ t: "op", o });
  } else if (k === "%") {
    if (endsWithValue()) {
      T.push({ t: "pct" });
      s.justEvaluated = false;
    }
  } else if (k === "±") {
    s.justEvaluated = false;
    const l = last();
    if (isNum(l)) l.s = l.s.startsWith("-") ? l.s.slice(1) : `-${l.s}`;
    else if (!l || l.t === "op" || l.t === "open") T.push({ t: "num", s: "-" });
    const n = last();
    if (isNum(n) && n.s === "") T.pop();
  } else if (k === "(") {
    resetIfEvaluated();
    if (endsWithValue()) T.push({ t: "op", o: "×" });
    T.push({ t: "open" });
  } else if (k === ")") {
    if (openCount() > 0 && endsWithValue()) T.push({ t: "close" });
  } else if (k === "⌫") {
    s.justEvaluated = false;
    const l = last();
    if (isNum(l) && l.s.length > 1 && !(l.s.length === 2 && l.s.startsWith("-"))) l.s = l.s.slice(0, -1);
    else T.pop();
  } else if (k === "C") {
    T.length = 0;
    s.justEvaluated = false;
  } else if (k === "=") {
    if (!T.length || s.justEvaluated) return { state: s, result: "ok" };
    try {
      const v = evaluate(T);
      s.history = [{ expr: exprText(T, true), v }, ...s.history].slice(0, 12);
      s.tokens = [{ t: "num", s: rawOf(v) }];
      s.justEvaluated = true;
      return { state: s, result: "equals" };
    } catch (err) {
      const code = err instanceof Err ? err.code : "invalid";
      s.error = code;
      return { state: s, result: code };
    }
  }
  return { state: s, result: "ok" };
}

export function fromHistory(prev: CalcState, v: number): CalcState {
  return { ...prev, tokens: [{ t: "num", s: rawOf(v) }], justEvaluated: true, error: null };
}

/** Main display text: the number being typed, or the live result. */
export function mainText(state: CalcState) {
  const l = state.tokens[state.tokens.length - 1];
  if (isNum(l) && l.s !== "-") return fmtTyped(l.s);
  if (isNum(l)) return "−";
  const pv = preview(state);
  return pv !== null ? fmtNum(pv) : "0";
}
