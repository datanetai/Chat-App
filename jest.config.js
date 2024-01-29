module.exports = {
    testEnvironment: 'jsdom',

    moduleFileExtensions: [
        'js',
        'ts',
        'vue'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',

    },
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.vue$': '@vue/vue3-jest',
    },
    testMatch: [
        '**/tests/unit/**/*.spec.ts'
    ],

}