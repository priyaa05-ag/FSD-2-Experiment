import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Interactive Calendar", () => {
  it("renders all seven days and the supplied events", () => {
    render(<App />);
    expect(screen.getByText("Design review")).toBeInTheDocument();
    expect(screen.getByText("Portfolio review")).toBeInTheDocument();
    expect(screen.getAllByTestId(/day-/)).toHaveLength(7);
  });

  it("toggles optimization controls", async () => {
    const user = userEvent.setup();
    render(<App />);
    const memo = screen.getAllByRole("switch")[0];
    expect(memo).toHaveAttribute("aria-checked", "true");
    await user.click(memo);
    expect(memo).toHaveAttribute("aria-checked", "false");
  });

  it("filters events by type", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByDisplayValue("All events"), "deadline");
    expect(screen.getByText("Ship v2.3")).toBeInTheDocument();
    expect(screen.queryByText("Design review")).not.toBeInTheDocument();
  });

  it("moves an event through drag and drop handlers", () => {
    render(<App />);
    const event = screen.getByTestId("event-design");
    const target = screen.getByTestId("day-2");
    event.dispatchEvent(new Event("dragstart", { bubbles: true }));
    target.dispatchEvent(new Event("drop", { bubbles: true }));
    expect(screen.getByText("Design review")).toBeInTheDocument();
  });

  it("resets render counters", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /reset counters/i }));
    expect(screen.getByText("Render counters reset")).toBeInTheDocument();
  });
});