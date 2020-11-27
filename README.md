# mExport

[![Codecov](https://img.shields.io/codecov/c/github/ealenn/mExport?style=for-the-badge&logo=codecov)](https://codecov.io/gh/Ealenn/mExport)
[![GitHub stars](https://img.shields.io/github/stars/Ealenn/mExport?style=for-the-badge&logo=github)](https://github.com/Ealenn/mExport/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Ealenn/mExport?style=for-the-badge&logo=github)](https://github.com/Ealenn/mExport/issues)

![](./preview.png)

mExport is a command line interface (CLI) for processing and sorting emails.

- Display precise statistics on your emails 
- Easily unsubscribe from mailing lists

## Installation

``` bash
npm i -g mexport
```

## Getting Started

### Login to Server

``` bash
# With Interactive Mode
mexport login

# Without Interactive Mode
mexport login \
  -u, --user [user] \
  -p, --password [password] \
  -s, --server [server] \
  -i, --port [port] \
  --secure
```

## Development

``` bash
node ./dist/Main.js [command]
```

- `build`: Build project
- `build:watch` : Hot-Reload build
- `test`: Run tests with code coverage
- `local`: Install mexport with local project
- `refresh`: Refresh npm packages
