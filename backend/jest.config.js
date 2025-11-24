module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    testTimeout: 30000, // 30 seconds timeout
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/tests/**',
      '!src/config/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html']
  };
  