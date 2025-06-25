// Mock window.matchMediaimport { test, expect, vi } from "vitest"; // ✅ Import only what we need
import { render, screen, act } from '@testing-library/react';
import App from '../App';
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

test('renders app', async () => {
  await act(async () => {
    render(<App />);
    });
  expect(await screen.getByTestId('tasks-list')).toBeTruthy(); // TODO
});
