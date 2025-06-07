// module.exports = {
//     preset: 'jest-preset-angular',
//     setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
//     testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
//     coverageDirectory: './coverage',
//     coverageReporters: ['html', 'text-summary']
// };

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)',
        '<rootDir>/src/tests/module/**/*.spec.ts' // Добавляем вашу директорию
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.(ts|js|html)$': [
            'jest-preset-angular',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
                stringifyContentPathRegex: '\\.html$',
                isolatedModules: true
            }
        ]
    },
    coverageDirectory: './coverage',
    coverageReporters: ['html', 'text-summary']
};