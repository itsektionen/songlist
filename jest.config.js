/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	noStackTrace: true,
	setupFilesAfterEnv: ['jest-expect-message'],
};
