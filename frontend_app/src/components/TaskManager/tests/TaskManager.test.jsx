// Mock window.matchMediaimport { test, expect, vi } from "vitest"; // ✅ Import only what we need
import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
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
        data: { title: 'New Task Title', description: 'Test Task Description' },
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

// test.skip('renders task list', async () => {
//   render(<TaskManager />);
//   expect(screen.getByTestId('taskmanager-title')).toBeTruthy();
// });

test('can add a new task', async () => {
  render(<TaskManager />);
  expect(screen.getByTestId('taskmanager-title')).toBeTruthy();

  const addTaskBtn = screen.getByTestId('addTaskBtn');
  expect(addTaskBtn).toBeDefined();
  await act(async () => {
    fireEvent.click(addTaskBtn);
  });
  expect(await screen.getByTestId('AddOrEditForm')).toBeInTheDocument();
  /* assert on the output */
  
  const inputTitle = screen.getByTestId('input-title');
  expect(inputTitle).toBeDefined();

  const inputDescription = screen.getByTestId('input-description');
  expect(inputDescription).toBeDefined();

  const SaveButton = screen.getByTestId('dialog-saveBtn');
  // SaveButton.textContent = 'Save';
  expect(SaveButton).toBeDefined();
  expect(SaveButton.textContent).toBe('Add');


  const CancelButton = screen.getByTestId('dialog-cancelBtn');
  expect(CancelButton).toBeDefined();


  fireEvent.change(inputTitle, {
    target: { value: "New Task Title" },
  });
  fireEvent.change(inputDescription, {
    target: { value: "Test Task Description" },
  });
  fireEvent.click(SaveButton);
  // ✅ Debugging: Print the updated DOM
  await waitFor(() => { 
    // console.log(screen.debug());
    const taskList = screen.getByTestId("tasks-list"); // Get the <ul> element 
    expect(taskList.innerHTML).toContain("New Task Title"); // ✅ Ensures "New Task Title" appears in the list
    expect(taskList.innerHTML).toContain("Test Task Description"); // ✅ Ensures "Test Task Description" appears in the list
  });
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



test.skip("displays empty state when no tasks are available", async () => {
  render(<App />);
  waitFor(() => {
    expect(screen.getByText("ababagalamaga")).toBeTruthy();
  });
});
