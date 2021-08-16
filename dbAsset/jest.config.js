/*
 * BBE - API SERVICE

 */

// jest.config.js
const {defaults} = require('jest-config');

module.exports = {
    verbose: true,
    roots: ["<rootDir>/tests","<rootDir>/src"],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/','src/config'],
    testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!<rootDir>/node_modules/",
        "!src/index.ts",
        "!src/app.ts",
        "!src/interfaces/routing-controller.ts",
        "!src/services/fabricSDKService.ts",
        "!src/routers/authRouter.ts",
        "!src/config/*.ts"
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 75,
            lines: 75,
            statements: 75
        }
    },
    coverageReporters: ['json', 'lcov']
}