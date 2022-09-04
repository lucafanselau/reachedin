/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    globalTeardown: "./test-teardown-globals.js", //needed to avoid any open handles while working with mongo db
    globals: {
        "ts-jest": {
            isolatedModules: false
        } //by default ts-jest does not optimize the test speed. By setting this option to true, the test speed is increased.
    }
};
