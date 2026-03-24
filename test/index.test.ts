import { describe, expect, it, vi } from "vitest";
import { debounce } from "../src/index.js";

describe("debounce", () => {
  it("runs the callback on the trailing edge by default", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounce(callback, 50);

    debounced("first");
    debounced("second");

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });

  it("supports leading invocations", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounce(callback, 50, { leading: true, trailing: false });

    debounced("value");
    debounced("ignored");

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("value");
  });

  it("cancels pending invocations", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounce(callback, 50);

    debounced("value");
    debounced.cancel();
    vi.advanceTimersByTime(50);

    expect(callback).not.toHaveBeenCalled();
  });

  it("flushes pending invocations immediately", () => {
    vi.useFakeTimers();
    const callback = vi.fn((value: string) => value.toUpperCase());
    const debounced = debounce(callback, 50);

    debounced("value");

    expect(debounced.flush()).toBe("VALUE");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("honors maxWait while calls continue", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounce(callback, 50, { maxWait: 120 });

    debounced("a");
    vi.advanceTimersByTime(40);
    debounced("b");
    vi.advanceTimersByTime(40);
    debounced("c");
    vi.advanceTimersByTime(40);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("c");
  });
});
