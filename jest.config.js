module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@services/(.*)": "<rootDir>/src/services/$1",
    "^@models/(.*)": "<rootDir>/src/models/$1"
  },
  modulePaths: ["<rootDir>/src"]
};
