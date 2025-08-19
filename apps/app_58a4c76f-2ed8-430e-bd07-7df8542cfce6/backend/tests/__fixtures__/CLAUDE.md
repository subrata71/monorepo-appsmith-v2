# Fixtures directory

Place static JSON or SQL seed files here that multiple test suites reuse.

## Examples

- `products.json` – seed products for e2e tests
- `orders.json` – complex order payloads

## Usage

```ts
import products from '__fixtures__/products.json' assert { type: 'json' };
```
