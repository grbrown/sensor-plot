import { renderHook, act } from "@testing-library/react";
import { useIsDarkMode } from "../useIsDarkMode";

describe("useIsDarkMode", () => {
  // Store the original matchMedia
  const originalMatchMedia = window.matchMedia;

  // Mock for matchMedia
  let mockMatchMedia: jest.Mock;
  let mockMediaQueryList: {
    matches: boolean;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };

  beforeEach(() => {
    // Create mocks
    mockMediaQueryList = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    mockMatchMedia = jest.fn().mockImplementation((query) => {
      return mockMediaQueryList;
    });

    // Override the default matchMedia implementation
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    // Restore original matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it("should initialize with the current system preference", () => {
    // Set up the mock to return light mode
    mockMediaQueryList.matches = false;

    // Render the hook
    const { result } = renderHook(() => useIsDarkMode());

    // Check if it's in light mode
    expect(result.current).toBe(false);

    // Set up the mock to return dark mode
    mockMediaQueryList.matches = true;

    // Render the hook again
    const { result: darkResult } = renderHook(() => useIsDarkMode());

    // Check if it's in dark mode
    expect(darkResult.current).toBe(true);
  });

  it("should respond to system theme changes", () => {
    // Start with light mode
    mockMediaQueryList.matches = false;

    // Render the hook
    const { result } = renderHook(() => useIsDarkMode());

    // Initial value should be light mode
    expect(result.current).toBe(false);

    // Check if addEventListener was called
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );

    // Get the callback function
    const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];

    // Simulate a change to dark mode
    act(() => {
      changeHandler({ matches: true });
    });

    // Value should now be dark mode
    expect(result.current).toBe(true);

    // Simulate a change back to light mode
    act(() => {
      changeHandler({ matches: false });
    });

    // Value should now be light mode again
    expect(result.current).toBe(false);
  });

  it("should clean up event listener on unmount", () => {
    // Render the hook
    const { unmount } = renderHook(() => useIsDarkMode());

    // Unmount the hook
    unmount();

    // Check if removeEventListener was called
    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });
});
