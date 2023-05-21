import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});

// This method is deprecated. find and use a better method insted.
// global.afterEach(async () => {
//   const conn = getConnection();
//   await conn.close();
// });
