module.exports = {
    verbose: true,
    setupFiles: ["dotenv/config"],
    testEnvironment: "node",
    collectCoverage: true,
    coverageThreshold: {
      global: {
        branches: 40,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },
    coveragePathIgnorePatterns: ["/node_modules/"],
    // collectCoverageFrom: ["./*.js"],
  };