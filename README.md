# TinaCMS

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Getting Started

- [Documentation](./docs/README.md)
  - [Gatsby Starter](./gatsby/starter-setup.md)
  - [Manual Setup](./gatsby/manual-setup.md)
- [Contributing](./CONTRIBUTING.md)

## Development

To get started:

```bash
git clone git@github.com:tinacms/tinacms.git
cd cms
npm run bootstrap
npm run build

# Start the Gatsby demo
cd packages/demo/demo-gatsby
npm run start
```

## Commands

| Commands                           | Descriptiton                                  |
| ---------------------------------- | --------------------------------------------- |
| npm run bootstrap                  | Install dependencies and link local packages. |
| npm run build                      | Build all packages                            |
| npm run test                       | Run tests for all packages                    |
| lerna run build --scope \<package> | Build only \<package>.                        |
| lerna run watch --parallel         | Watch all packages for rebuilds.              |

## Links

- [Circle CI](https://circleci.com/gh/forestryio/cms): Continuous Integration
