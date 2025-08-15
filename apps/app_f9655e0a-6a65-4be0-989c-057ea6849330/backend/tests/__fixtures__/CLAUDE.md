# Fixtures directory

Place static JSON or SQL seed files here that multiple test suites reuse.

## Examples

- `users.json` – seed users for `/login` e2e tests
- `orders.json` – complex order payloads

## Usage

```ts
import users from '__fixtures__/users.json' assert { type: 'json' };
```
