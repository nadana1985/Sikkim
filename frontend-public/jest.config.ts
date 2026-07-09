import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-leaflet-markercluster/styles$': '<rootDir>/__mocks__/react-leaflet-markercluster-styles.js',
  },

  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/e2e/', '<rootDir>/backend/'],
  collectCoverageFrom: [
    'src/lib/**/*.ts',
    'src/hooks/**/*.ts',
    'src/components/**/*.tsx',
    '!src/components/PanoramaViewer.tsx',
    '!src/components/MonasteryMap.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 70,
      lines: 85,
      statements: 85,
    },
    // Enforce stricter thresholds on critical modules
    'src/lib/api.ts': {
      branches: 80,
      functions: 80,
      lines: 90,
      statements: 90,
    },
    'src/hooks/useApi.ts': {
      branches: 80,
      functions: 80,
      lines: 90,
      statements: 90,
    },
  },
};

export default createJestConfig(config);
