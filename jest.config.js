/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Esto es clave para que Jest entienda tus archivos .ts
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // Esto resuelve el problema de los .js en tus imports de TS
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // Configuración para procesar TS con soporte ESM
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};