export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export type DebouncedFunction<TArgs extends unknown[], TResult> = ((...args: TArgs) => void) & {
  cancel: () => void;
  flush: () => TResult | undefined;
};

type TimerHandle = ReturnType<typeof setTimeout>;

interface DebounceState<TArgs extends unknown[], TResult> {
  lastArgs: TArgs | undefined;
  lastInvokeTime: number;
  lastCallTime: number | undefined;
  result: TResult | undefined;
  timerId: TimerHandle | undefined;
  maxTimerId: TimerHandle | undefined;
}

const now = () => Date.now();

export const createDebounce = <TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<TArgs, TResult> => {
  const leading = options.leading ?? false;
  const trailing = options.trailing ?? true;
  const maxWait = options.maxWait;

  if (!leading && !trailing) {
    throw new Error("debounce requires leading or trailing to be enabled");
  }

  const state: DebounceState<TArgs, TResult> = {
    lastArgs: undefined,
    lastInvokeTime: 0,
    lastCallTime: undefined,
    result: undefined,
    timerId: undefined,
    maxTimerId: undefined
  };

  const clearTimer = (timerId?: TimerHandle) => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
  };

  const clearAllTimers = () => {
    clearTimer(state.timerId);
    clearTimer(state.maxTimerId);
    state.timerId = undefined;
    state.maxTimerId = undefined;
  };

  const invoke = (time: number) => {
    if (!state.lastArgs) {
      return state.result;
    }

    const args = state.lastArgs;
    state.lastArgs = undefined;
    state.lastInvokeTime = time;
    state.result = fn(...args);
    return state.result;
  };

  const startWaitTimer = () => {
    clearTimer(state.timerId);
    state.timerId = setTimeout(() => {
      state.timerId = undefined;
      if (trailing && state.lastArgs) {
        invoke(now());
      }
      clearTimer(state.maxTimerId);
      state.maxTimerId = undefined;
    }, wait);
  };

  const startMaxWaitTimer = () => {
    if (maxWait === undefined) {
      return;
    }

    if (state.maxTimerId !== undefined) {
      return;
    }

    state.maxTimerId = setTimeout(() => {
      state.maxTimerId = undefined;
      if (state.lastArgs) {
        invoke(now());
      }
      clearTimer(state.timerId);
      state.timerId = undefined;
    }, maxWait);
  };

  const debounced = ((...args: TArgs) => {
    const time = now();
    const isInvokingLeading = leading && state.timerId === undefined;

    state.lastArgs = args;
    state.lastCallTime = time;

    if (isInvokingLeading) {
      invoke(time);
    }

    if (leading || trailing || maxWait !== undefined) {
      startWaitTimer();
    }

    startMaxWaitTimer();
  }) as DebouncedFunction<TArgs, TResult>;

  debounced.cancel = () => {
    clearAllTimers();
    state.lastArgs = undefined;
    state.lastCallTime = undefined;
  };

  debounced.flush = () => {
    if (!state.lastArgs) {
      clearAllTimers();
      return state.result;
    }

    const result = invoke(now());
    clearAllTimers();
    return result;
  };

  return debounced;
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options?: DebounceOptions
): DebouncedFunction<Parameters<T>, ReturnType<T>> => {
  return createDebounce<Parameters<T>, ReturnType<T>>(fn, wait, options);
};
