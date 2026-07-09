import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for jsdom (Node.js 18+)
import { TextEncoder, TextDecoder } from 'util';
Object.assign(globalThis, { TextEncoder, TextDecoder });

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link
jest.mock('next/link', () => {
  const React = require('react');
  return React.forwardRef(function MockLink(
    { children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown },
    ref: React.Ref<HTMLAnchorElement>
  ) {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    );
  });
});

// Mock next/image
jest.mock('next/image', () => {
  const React = require('react');
  return React.forwardRef(function MockImage(
    { src, alt, fill, className, sizes, ...props }: Record<string, unknown>,
    ref: React.Ref<HTMLImageElement>
  ) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        src={src as string}
        alt={alt as string}
        className={className as string}
        {...props}
      />
    );
  });
});

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const React = require('react');
  const createIcon = (name: string) => {
    const Icon = (props: Record<string, unknown>) => (
      <svg data-testid={`icon-${name}`} {...props} />
    );
    Icon.displayName = name;
    return Icon;
  };
  return new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        if (prop === '__esModule') return false;
        return createIcon(prop);
      },
    }
  );
});

// Mock @/components/ThemeProvider
jest.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'system',
    resolvedTheme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress console.error in tests (optional, helps with noisy React warnings)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
