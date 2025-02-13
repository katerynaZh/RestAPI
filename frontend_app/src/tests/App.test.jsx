import { test, expect, vi } from "vitest"; // ✅ Import only what we need
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import "@testing-library/jest-dom"; // ✅ Ensures matchers are loaded
import App from "../App";


// ✅ Mock axios properly
vi.mock("axios", () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })), // ✅ Mock an empty task list
    post: vi.fn(() =>
      Promise.resolve({
        data: { id: 1, title: "New Task", description: "Task Description", status: "pending" },
      })
    ),
  },
}));

test("renders task list", async () => {
  render(<App />);
  expect(screen.getByText("Task List")).toBeTruthy(); // ✅ Ensures the component renders
});

test("can add a new task", async () => {
  render(<App />);

  fireEvent.change(screen.getAllByPlaceholderText("Task title...")[0], {
    target: { value: "New Task" },
  });
  fireEvent.change(screen.getAllByPlaceholderText("Task description...")[0], {
    target: { value: "Task Description" },
  });

  fireEvent.click(screen.getAllByText("Add Task")[1]); // Clicks the first button

  // ✅ Debugging: Print the updated DOM
  await waitFor(() => {
    console.log(screen.debug()); // 🔍 Print the full component tree to see if "New Task" exists
  });

  // ✅ Check if the task list updates
  await waitFor(() => {
    const taskList = screen.getByRole("list"); // Get the <ul> element
    expect(taskList.innerHTML).toContain("New Task"); // ✅ Ensures "New Task" appears in the list
  });
});
