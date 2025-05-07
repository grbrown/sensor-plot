import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataPointMaximum, {
  DEFAULT_DATA_POINT_MAXIMUM,
} from "../DataPointMaximum";

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("DataPointMaximum", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it("renders with default maximum value", () => {
    render(<DataPointMaximum />);

    expect(
      screen.getByRole("heading", { name: /data point maximum/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/beyond this limit, graphs will discard points/i)
    ).toBeInTheDocument();

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe(DEFAULT_DATA_POINT_MAXIMUM.toString());
  });

  it("loads value from localStorage on mount", () => {
    const storedValue = "50000";
    localStorageMock.getItem.mockReturnValueOnce(storedValue);

    render(<DataPointMaximum />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith("dataPointMaximum");
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe(storedValue);
  });

  it("updates input value when user types", () => {
    render(<DataPointMaximum />);

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "75000" } });

    expect((input as HTMLInputElement).value).toBe("75000");
  });

  it("saves value to localStorage when save button is clicked", () => {
    render(<DataPointMaximum />);

    const input = screen.getByRole("spinbutton");
    const newValue = "75000";
    fireEvent.change(input, { target: { value: newValue } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "dataPointMaximum",
      newValue
    );
  });

  it("handles invalid input by setting value to 0", () => {
    render(<DataPointMaximum />);

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "not-a-number" } });

    expect((input as HTMLInputElement).value).toBe("0");
  });
});
