// lint-staged auto-discovers this file for anything staged under web/ and
// runs tasks with this directory as cwd. Function form ignores the staged
// filenames - `tsc --noEmit` in particular needs to run against the whole
// tsconfig project, not a file subset, or it silently stops checking
// anything outside the staged files.
export default {
  '*.{ts,tsx}': () => ['bunx tsc --noEmit', 'bun run lint'],
};
