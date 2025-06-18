/**
 * Unit tests for the AddOrEditDialog component.
 *
 * These tests verify the rendering and behavior of the AddOrEditDialog component
 * in different scenarios, such as adding a new task or editing an existing task.
 *
 * Tests:
 * - `renders the dialog with empty fields for adding a new task`:
 *   Verifies that the dialog renders correctly with empty fields when adding a new task.
 *   Checks for the presence of input fields, save button, and cancel button.
 *
 * - `renders the dialog with pre-filled fields for editing a task`:
 *   Verifies that the dialog renders correctly with pre-filled fields when editing an existing task.
 *   Checks for the presence of input fields with pre-filled values, status dropdown, save button, and cancel button.
 */
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import AddOrEditDialog from '../AddOrEditDialog';

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

describe('AddOrEditDialog', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const mockTask = {
    id: '21797e7e-f23f-42ce-ae58-ae3344585dff',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    parent: '',
  };

  const mockStatuses = ['pending', 'completed'];

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Rendering Tests
  it('renders the dialog with empty fields for adding a new task', () => {
    render(
      <AddOrEditDialog
        open={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

      expect(screen.getByTestId('AddOrEditForm')).toBeInTheDocument();
    
      const inputTitle = screen.getByTestId('input-title');
      expect(inputTitle).toBeDefined();
    
      const inputDescription = screen.getByTestId('input-description');
      expect(inputDescription).toBeDefined();
    
      const saveButton = screen.getByTestId('dialog-confirmBtn');
      expect(saveButton).toBeDefined();
      expect(saveButton.textContent).toBe('Add');
    
      const cancelButton = screen.getByTestId('dialog-cancelBtn');
      expect(cancelButton).toBeDefined();
    
  });

  
  it('renders the dialog with pre-filled fields for editing a task', () => {
    render(
      <AddOrEditDialog
        open={true}
        task={mockTask}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        statuses={mockStatuses}
      />
    );

    expect(screen.getByTestId('AddOrEditForm')).toBeInTheDocument();
    
    const inputTitle = screen.getByTestId('input-title');
    expect(inputTitle).toBeDefined();
    expect(inputTitle.value).toBe(mockTask.title);
  
    const inputDescription = screen.getByTestId('input-description');
    expect(inputDescription).toBeDefined();
    expect(inputDescription.value).toBe(mockTask.description);

    const inputStatus = screen.getByTestId('input-status');
    expect(inputStatus).toBeDefined();
    expect(mockStatuses).toContain(inputStatus.textContent);

    const saveButton = screen.getByTestId('dialog-confirmBtn');
    expect(saveButton).toBeDefined();
    expect(saveButton.textContent).toBe('Save');
  
    const cancelButton = screen.getByTestId('dialog-cancelBtn');
    expect(cancelButton).toBeDefined();
  });
});
