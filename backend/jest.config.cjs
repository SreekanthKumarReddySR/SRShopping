module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  moduleFileExtensions: ["js", "json", "jsx", "node"],
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
  testTimeout: 30000
};