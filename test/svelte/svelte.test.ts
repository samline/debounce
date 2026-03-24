import { get } from "svelte/store";
import { describe, expect, it, vi } from "vitest";
import { createDebouncedStore } from "../../src/svelte/index.js";

describe("svelte helpers", () => {
  it("debounces store updates", () => {
    vi.useFakeTimers();
    const store = createDebouncedStore("a", 50);

    store.set("b");
    expect(get(store)).toBe("a");

    vi.advanceTimersByTime(50);

    expect(get(store)).toBe("b");
  });
});
