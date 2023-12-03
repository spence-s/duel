import {cp, rmdir, rename} from 'node:fs/promises';
import path from 'node:path';
import tempDir from 'temp-dir';
import {$} from 'execa';
import {globby} from 'globby';

export type Options = {
  cwd: string;
};

export async function createCjsBuild({cwd}: Options) {
  const temporaryBasePath = path.join(tempDir, 'duel');

  // remove the temporary directory if it exists
  try {
    await rmdir(temporaryBasePath, {recursive: true});
  } catch {}

  // copy the files to a temporary directory
  // ignore the dist directory and all node_modules except for typescript
  await cp(cwd, temporaryBasePath, {
    recursive: true,
  });

  // get all the fi'.les in the temp directory
  const files = await globby(
    ['**/*.ts', '**/*.mts', '!**/*.d.ts', '!**/node_modules/**/*'],
    {
      cwd: temporaryBasePath,
    },
  );

  // rename all the specifiers to .cts
  await Promise.all(
    files.map(async (file) =>
      rename(
        path.join(temporaryBasePath, file),
        path.join(temporaryBasePath, file.replace(/\.m?ts$/, '.cts')),
      ),
    ),
  );

  // run typescript build again
  await $({cwd: temporaryBasePath, stdio: 'inherit'})`tsc`;

  // copy back over the build to the original directory
  await cp(path.join(temporaryBasePath, 'dist'), path.join(cwd, 'cjs-dist'), {
    recursive: true,
  });
}
