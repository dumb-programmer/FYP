import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    setupFilesAfterEnv: ["./tests/setup.ts"],
    globalTeardown: "./tests/teardown.ts"
};

export default config;
