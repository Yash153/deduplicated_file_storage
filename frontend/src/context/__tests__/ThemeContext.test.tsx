import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock matchMedia
const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Test component that uses the theme
const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-status">
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset document class
    document.documentElement.classList.remove('dark');
  });

  it('initializes with light theme when no saved preference', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: false,
      media: query,
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('Light Mode');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('initializes with dark theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark Mode');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles theme and updates localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initial state
    expect(screen.getByTestId('theme-status')).toHaveTextContent('Light Mode');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle theme
    act(() => {
      screen.getByText('Toggle Theme').click();
    });

    // Check updated state
    expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark Mode');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

    // Toggle back
    act(() => {
      screen.getByText('Toggle Theme').click();
    });

    // Check final state
    expect(screen.getByTestId('theme-status')).toHaveTextContent('Light Mode');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('uses system preference when no saved theme', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: true, // Simulate system preference for dark mode
      media: query,
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('Dark Mode');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
}); 