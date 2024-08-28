import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: 'node',
    setupFilesAfterEnv: ["./tests/setup.ts"],
    globalTeardown: "./tests/teardown.ts",
};

export default config;
