import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebouncedCallback, useDebouncedValue } from "../../src/react/index.js";

describe("react hooks", () => {
  it("debounces callback execution", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 50));

    act(() => {
      result.current("first");
      result.current("second");
      vi.advanceTimersByTime(50);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });

  it("debounces values", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 50), {
      initialProps: { value: "a" }
    });

    rerender({ value: "b" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current).toBe("b");
  });
});
