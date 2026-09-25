# Repository conventions

## Commits

- Write commit messages in simple, clear English.
- Use the Conventional Commits format: `type(scope): subject` or `type: subject`.
- Use a short, lowercase imperative subject without a trailing period.
- Prefer a type that describes the change, such as `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`.
- Example: `feat: add Apps Script web app deployment`.

## Comments

- Add comments only when they explain intent, a constraint, or work that remains.
- Use Better Comments' default tags for annotated comments:
  - `// !` for a warning or important caveat.
  - `// ?` for an open question.
  - `// TODO:` for concrete follow-up work.
  - `// *` for an important explanation or highlight.
- In files with another comment syntax, use the equivalent syntax with the same tag (for example, `# TODO:`).
- Keep annotations concise and remove them when they no longer apply.
