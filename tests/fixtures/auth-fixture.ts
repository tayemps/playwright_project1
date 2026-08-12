import { test as base } from '@playwright/test';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentFile = fileURLToPath(import.meta.url);
const fixtureDir = dirname(currentFile);
const storageState = resolve(fixtureDir, '..', '..', 'test-results', 'auth-storage-state.json');

export const test = base.extend({
    storageState,
});

export { expect } from '@playwright/test';
