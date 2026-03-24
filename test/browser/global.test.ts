import { describe, expect, it } from "vitest";

describe("browser global", () => {
  it("attaches debounce API to globalThis", async () => {
    const previous = (globalThis as typeof globalThis & { Debounce?: unknown }).Debounce;

    await import("../../src/browser/global.js");

    expect((globalThis as typeof globalThis & { Debounce?: unknown }).Debounce).toBeDefined();

    (globalThis as typeof globalThis & { Debounce?: unknown }).Debounce = previous;
  });
});