/**
 * Unit tests for the TaskManager component.
 * These tests cover the following functionalities:
 * 
 * 1. Adding a new task:
 *    - Renders the TaskManager component.
 *    - Opens the "Add Task" form and fills in the task details.
 *    - Submits the form and verifies that the new task appears in the task list.
 * 
 * 2. Editing an existing task:
 *    - Renders the TaskManager component.
 *    - Locates an existing task in the task list.
 *    - Opens the "Edit Task" form, updates the task details, and changes the status.
 *    - Submits the form and verifies that the updated task details are reflected in the task list.
 * 
 * 3. Deleting a task:
 *    - Renders the TaskManager component within a ConfirmationDialogProvider.
 *    - Locates an existing task in the task list.
 *    - Triggers the delete action and confirms the deletion in the confirmation dialog.
 *    - Verifies that the task is removed from the task list.
 * 
 * Mocking:
 * - Axios is mocked to simulate API responses for GET, POST, PATCH, and DELETE requests.
 * - Mock data includes task details and available statuses.
 */
import { render, screen, fireEvent, within, waitFor, act } from '@testing-library/react';
import TaskManager from '../index';
import { ConfirmationDialogProvider } from '../../../contexts/ConfirmationDialogContext';
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

const statuses = ["pending", "in_progress", "completed", "archived"];

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url) => {
        if (url === 'http://localhost:8000/v1/tasks') {
          return Promise.resolve({
            data: [
              {
                id: '21797e7e-f23f-42ce-ae58-ae3344585dff',
                title: 'Some Existing Task',
                description: 'This is a test task',
                status: 'pending',
                parent: null,
              },
            ],
          });
        }

        if (url === 'http://localhost:8000/v1/tasks/statuses') {
          return Promise.resolve({
            data: statuses,
          });
        }

        return Promise.reject(new Error('Unhandled GET request: ' + url));
      }),

      post: vi.fn(() =>
        Promise.resolve({
          data: {
            id: '21797e7e-f23f-42ce-ae58-ae3344585dff',
            title: 'New Task Title',
            description: 'Test Task Description',
            status: 'pending',
            parent: null,
          },
        })
      ),

      patch: vi.fn(() =>
        Promise.resolve({
          data: {
            id: '21797e7e-f23f-42ce-ae58-ae3344585dff',
            status: 'completed',
            title: 'Updated Task Title',
            description: 'Updated Task Description',
            parent: null,
          },
        })
      ),

      delete: vi.fn(() => Promise.resolve({})),
    },
  };
});

test('can add a new task', async () => {
  render(<TaskManager />);
  expect(screen.getByTestId('taskmanager-title')).toBeTruthy();

  const addTaskBtn = screen.getByTestId('addTaskBtn');
  expect(addTaskBtn).toBeDefined();
  await act(async () => {
    fireEvent.click(addTaskBtn);
  });
  expect(await screen.getByTestId('AddOrEditForm')).toBeInTheDocument();
  
  const inputTitle = screen.getByTestId('input-title');
  expect(inputTitle).toBeDefined();

  const inputDescription = screen.getByTestId('input-description');
  expect(inputDescription).toBeDefined();

  const saveButton = screen.getByTestId('dialog-confirmBtn');

  expect(saveButton).toBeDefined();
  expect(saveButton.textContent).toBe('Add');


  const cancelButton = screen.getByTestId('dialog-cancelBtn');
  expect(cancelButton).toBeDefined();


  fireEvent.change(inputTitle, {
    target: { value: "New Task Title" },
  });
  fireEvent.change(inputDescription, {
    target: { value: "Test Task Description" },
  });
  fireEvent.click(saveButton);
  await waitFor(() => {
    const taskList = screen.getByTestId("tasks-list"); // Get the <ul> element 
    expect(taskList.innerHTML).toContain("New Task Title"); // ✅ Ensures "New Task Title" appears in the list
    expect(taskList.innerHTML).toContain("Test Task Description"); // ✅ Ensures "Test Task Description" appears in the list
  });
});

test('can edit task', async () => {
  render(<TaskManager />);
  const taskList = await screen.findByTestId('tasks-list');
  expect(taskList).toBeTruthy();

  // Check that the specific task exists (by task title)
  const taskItem = within(taskList).getByText(/Some Existing Task/i);
  expect(taskItem).toBeInTheDocument();

  const taskItemList = taskItem.closest('li'); // Find the closest list item (parent element of taskItem)
  const editTaskBtn = within(taskItemList).getByTestId('editTaskBtn'); // Get the button inside the same list item
  expect(editTaskBtn).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(editTaskBtn);
  });
  expect(await screen.getByTestId('AddOrEditForm')).toBeInTheDocument();

  const inputTitle = screen.getByTestId('input-title');
  expect(inputTitle).toBeDefined();

  const inputDescription = screen.getByTestId('input-description');
  expect(inputDescription).toBeDefined();

  const inputStatus = screen.getByTestId('input-status');
  expect (statuses).contains(inputStatus.textContent);

  const saveButton = screen.getByTestId('dialog-confirmBtn');
  
  expect(saveButton).toBeDefined();
  expect(saveButton.textContent).toBe('Save');

  const cancelButton = screen.getByTestId('dialog-cancelBtn');
  expect(cancelButton).toBeDefined();

  fireEvent.change(inputTitle, {
    target: { value: "Updated Task Title" },
  });
  fireEvent.change(inputDescription, {
    target: { value: "Updated Task Description" },
  });

  const selectorButton = inputStatus.querySelector('.ant-select-selector');
  if (!selectorButton) {
    throw new Error('Selector button not found');
  }
  fireEvent.mouseDown(selectorButton);
  fireEvent.click(await screen.findByText('completed'));
  fireEvent.click(saveButton);

  const updatedTaskList = await screen.findByTestId('tasks-list');
  expect(taskList).toBeTruthy();

  // Check that the specific task exists (by task title)
  const updatedTaskItem = within(updatedTaskList).getByText(/Updated Task Title/i);
  expect(updatedTaskItem).toBeInTheDocument();

  const updatedTaskItemParent = updatedTaskItem.closest('li'); // Find the closest list item (parent element of updatedTaskItem)

  // Check that the updated task description and status are also present
  const updatedTaskDescription = within(updatedTaskItemParent).getByText(/Updated Task Description/i);
  expect(updatedTaskDescription).toBeInTheDocument();
  
  // Check that the updated task status is displayed
  const updatedTaskStatus = within(updatedTaskItemParent).getByText(/completed/i);
  expect(updatedTaskStatus).toBeInTheDocument();
});


test('can delete a task', async () => {
  render(
    <ConfirmationDialogProvider>
      <TaskManager />
    </ConfirmationDialogProvider>
  );
  const taskList = await screen.findByTestId('tasks-list');
  expect(taskList).toBeTruthy();

  // Check that the specific task exists (by task title)
  const taskItem = within(taskList).getByText(/Some Existing Task/i);
  expect(taskItem).toBeInTheDocument();

  const taskItemList = taskItem.closest('li'); // Find the closest list item (parent element of taskItem)
  const delTaskBtn = within(taskItemList).getByTestId('deleteTaskBtn'); // Get the button inside the same list item
  expect(delTaskBtn).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(delTaskBtn);
  });
  
  const confirmDlg = await screen.getByTestId('dialog');
  const confirmBtn = within(confirmDlg).getByTestId('dialog-confirmBtn');

  // ⑤  confirm and assert it disappeared
  fireEvent.click(confirmBtn);
  await waitFor(() =>
    expect(screen.queryByText(/Some Existing Task/i)).not.toBeInTheDocument(),
  );

});
