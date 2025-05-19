// Mock window.matchMediaimport { test, expect, vi } from "vitest"; // ✅ Import only what we need
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import "@testing-library/jest-dom"; // ✅ Ensures matchers are loaded
import TaskManager from '../index';
import { test, expect, vi } from 'vitest';

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() =>
      Promise.resolve({
        data: { title: 'New Task', description: 'Task Description' },
      })
    ),
    patch: vi.fn(() =>
      Promise.resolve({
        data: {
          id: '21797e7e-f23f-42ce-ae58-ae3344585dff',
          status: 'completed',
          title: 'New Task',
          description: 'Task Description',
          parent: null,
        },
      })
    ),
    delete: vi.fn(() => Promise.resolve({})),
  },
}));

test('renders task list', async () => {
  render(<TaskManager />);
  expect(screen.getByTestId('taskmanager-title')).toBeTruthy();
});

test('can add a new task', async () => {
  render(<TaskManager />);
  expect(screen.getByTestId('taskmanager-title')).toBeTruthy();

  const addTaskBtn = screen.getAllByTestId('addTaskBtn')[0];
  expect(addTaskBtn).toBeDefined();
  fireEvent.click(addTaskBtn);

  const add_dialog = screen.getAllByText('Add Task')[0];
  expect(add_dialog).toBeDefined();

  // fireEvent.click(screen.getByTestId("addTaskBtn"));
  // fireEvent.change(screen.getByTestId("input-title"), {
  //   target: { value: "New Task" },
  // });
  // fireEvent.change(screen.getByTestId("input-description"), {
  //   target: { value: "Task Description" },
  // });

  // await waitFor(() => {
  //   const taskList = screen.getByRole("list");
  //   expect(taskList.innerHTML).toContain("New Task");
  // });
});

test.skip('can delete a task', async () => {
  render(<TaskManager />);
  fireEvent.click(screen.getByTestId('delete-task-btn-1')); // Assuming task with id 1 exists

  await waitFor(() => {
    expect(screen.queryByText('New Task')).toBeNull();
  });
});

test.skip('can mark a task as completed', async () => {
  render(<TaskManager />);
  fireEvent.click(screen.getByTestId('complete-task-btn-1')); // Assuming task with id 1 exists

  await waitFor(() => {
    expect(screen.getByTestId('task-status-1').textContent).toBe('completed');
  });
});

// Mock window.matchMedia
// window.matchMedia = window.matchMedia || function() {
//   return {
//     matches: false,
//     addListener: function() {},
//     removeListener: function() {}
//   };
// };

// ✅ Mock axios properly
// vi.mock("axios", () => ({
//   default: {
//     get: vi.fn(() => Promise.resolve({ data: [] })), // ✅ Mock an empty task list
//     post: vi.fn(() =>
//       Promise.resolve({
//         data: { id: 1, title: "New Task", description: "Task Description", status: "pending" },
//       })
//     ),
//   },
// }));

// test("renders task list", async () => {
//   render(<App />);
//   expect(screen.getByTestId("tasks-list")).toBeTruthy(); // ✅ Ensures the component renders
// });

test.skip('can add a new task', async () => {
  render(<TaskManager />);
  // fireEvent.click(screen.getByTestId("editing-task-btn")[0]);

  expect(screen.getByTestId('input-title')).toBeTruthy();
  // fireEvent.change(screen.getByTestId("input-title"), {
  //   target: { value: "New Task" },
  // });
  // fireEvent.change(screen.getByTestId("input-description"), {
  //   target: { value: "Task Description" },
  // });

  // fireEvent.click(screen.getByTestId("update-task-btn")); // Clicks the first button

  // // ✅ Debugging: Print the updated DOM
  // await waitFor(() => {
  //   console.log(screen.debug()); // 🔍 Print the full component tree to see if "New Task" exists
  // });

  // // ✅ Check if the task list updates
  // await waitFor(() => {
  //   const taskList = screen.getByRole("list"); // Get the <ul> element
  //   expect(taskList.innerHTML).toContain("New Task"); // ✅ Ensures "New Task" appears in the list
  // });
});

// test("displays empty state when no tasks are available", async () => {
//   render(<App />);
//   waitFor(() => {
//     expect(screen.getByText("ababagalamaga")).toBeTruthy();
//   });
// });
