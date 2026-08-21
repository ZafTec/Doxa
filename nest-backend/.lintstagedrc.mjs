// lint-staged auto-discovers this file for anything staged under
// nest-backend/ and runs tasks with this directory as cwd. The function form
// ignores the staged filenames lint-staged would otherwise append - typed
// ESLint rules here need the whole project's type info anyway (see
// eslint.config.mjs's `projectService: true`), so partial-file linting isn't
// meaningfully faster, just less correct. This is exactly the CI lint step,
// run before the commit exists instead of after it's pushed.
export default {
  '*.ts': () => 'bun run lint',
};
