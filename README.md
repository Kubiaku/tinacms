# TinaCMS

[![Slack](https://img.shields.io/badge/slack-tinacms-blue.svg?logo=slack)](https://tinacms.slack.com)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Getting Started

- [Website](https://tinacms.org/)
- [Documentation](https://tinacms.org/docs/)
- [Roadmap](./ROADMAP.md)
- [Contributing](./CONTRIBUTING.md)
  - [How to Contribute](./CONTRIBUTING.md#How-to-Contribute)
  - [Creating Packages](./CONTRIBUTING.md#Creating-Packages)
  - [Troubleshooting in Development](./CONTRIBUTING.md#Troubleshooting-in-Development)
  - [Releasing](./CONTRIBUTING.md#Releasing)

[![Tina Demo](https://tinacms.org/86eeb01f0e69c12bb5603865954d79ba/temporary_show_tina.gif)](https://tinacms.org/)

## Development

To get started:

```bash
git clone git@github.com:tinacms/tinacms.git
cd tinacms
npm run bootstrap

# Start the Gatsby demo
cd packages/demo/demo-gatsby
npm run start
```

### Commands

| Commands                           | Descriptiton                                  |
| ---------------------------------- | --------------------------------------------- |
| npm run bootstrap                  | Install dependencies and link local packages. |
| npm run build                      | Build all packages                            |
| npm run watch                      | Watch all packages for rebuilds.              |
| npm run test                       | Run tests for all packages                    |
| lerna run build --scope \<package> | Build only \<package>.                        |
