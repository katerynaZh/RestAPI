import { render, screen, fireEvent, within } from '@testing-library/react';
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
  it.skip('renders the dialog with empty fields for adding a new task', () => {
    render(
      <AddOrEditDialog
        open={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        statuses={mockStatuses}
      />
    );

    expect(screen.getByPlaceholderText('Enter task title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter task description')).toHaveValue(
      ''
    );
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
    expect(screen.getByTestId('dialog-confirmBtn')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  
  // it('renders the dialog with pre-filled fields for editing a task', () => {
  //   render(
  //     <AddOrEditDialog
  //       open={true}
  //       task={mockTask}
  //       onSave={mockOnSave}
  //       onCancel={mockOnCancel}
  //       statuses={mockStatuses}
  //     />
  //   );

  //   expect(screen.getByPlaceholderText('Enter task title')).toHaveValue(
  //     'Test Task'
  //   );
  //   expect(screen.getByPlaceholderText('Enter task description')).toHaveValue(
  //     'Test Description'
  //   );
  //   expect(screen.getByText('Status')).toBeInTheDocument();
  //   expect(screen.getByText('Edit Task')).toBeInTheDocument();
  // });

  // Validation Tests
  // it('shows validation error when the title field is empty', async () => {
  //   render(
  //     <AddOrEditDialog
  //       open={true}
  //       onSave={mockOnSave}
  //       onCancel={mockOnCancel}
  //       statuses={mockStatuses}
  //     />
  //   );

  //   fireEvent.click(screen.getByText('Add'));
  //   expect(await screen.findByText('Title is required')).toBeInTheDocument();
  // });

  // it('shows validation error when the status field is empty for editing', async () => {
  //   render(
  //     <AddOrEditDialog
  //       open={true}
  //       task={mockTask}
  //       onSave={mockOnSave}
  //       onCancel={mockOnCancel}
  //       statuses={mockStatuses}
  //     />
  //   );

  //   fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
  //     target: { value: '' },
  //   });
  //   fireEvent.click(screen.getByText('Save'));
  //   expect(await screen.findByText('Title is required')).toBeInTheDocument();
  // });

  // // Interaction Tests
  // it('calls onSave with correct data when adding a new task', async () => {
  //   render(
  //     <AddOrEditDialog
  //       open={true}
  //       onSave={mockOnSave}
  //       onCancel={mockOnCancel}
  //       statuses={mockStatuses}
  //     />
  //   );

  //   fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
  //     target: { value: 'New Task' },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText('Enter task description'), {
  //     target: { value: 'New Description' },
  //   });
  //   fireEvent.click(screen.getByText('Add'));

  //   expect(mockOnSave).toHaveBeenCalledWith({
  //     title: 'New Task',
  //     description: 'New Description',
  //   });
  // });

  // it('calls onSave with updated data when editing a task', async () => {
  //   render(
  //     <AddOrEditDialog
  //       open={true}
  //       task={mockTask}
  //       onSave={mockOnSave}
  //       onCancel={mockOnCancel}
  //       statuses={mockStatuses}
  //     />
  //   );

  //   fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
  //     target: { value: 'Updated Task' },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText('Enter task description'), {
  //     target: { value: 'Updated Description' },
  //   });
  //   fireEvent.change(screen.getByRole('combobox'), {
  //     target: { value: 'completed' },
  //   });
  //   fireEvent.click(screen.getByText('Save'));

  //   expect(mockOnSave).toHaveBeenCalledWith({
  //     ...mockTask,
  //     title: 'Updated Task',
  //     description: 'Updated Description',
  //     status: 'completed',
  //   });
  // });

  // it('calls onCancel when the cancel button is clicked', () => {
  //   render(
  //     <AddOrEditDialog
  //       open={true}
  //       onSave={mockOnSave}
  //       onCancel={mockOnCancel}
  //       statuses={mockStatuses}
  //     />
  //   );

  //   fireEvent.click(screen.getByText('Cancel'));
  //   expect(mockOnCancel).toHaveBeenCalled();
  // });

  // // Conditional Rendering Tests
  // it('does not render the status field when adding a new task', () => {
  //   render(
  //     <AddOrEditDialog
  //       open={true}
  //       onSave={mockOnSave}
  //       onCancel={mockOnCancel}
  //       statuses={mockStatuses}
  //     />
  //   );

  //   expect(screen.queryByText('Status')).not.toBeInTheDocument();
  // });

  // it('renders the status field when editing an existing task', () => {
  //   render(
  //     <AddOrEditDialog
  //       open={true}
  //       task={mockTask}
  //       onSave={mockOnSave}
  //       onCancel={mockOnCancel}
  //       statuses={mockStatuses}
  //     />
  //   );

  //   expect(screen.getByText('Status')).toBeInTheDocument();
  // });
  
});
