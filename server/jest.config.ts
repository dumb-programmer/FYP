import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    setupFiles: ["./tests/setup.ts"]
};

export default config;
