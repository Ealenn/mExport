# mExport

[![Codecov](https://img.shields.io/codecov/c/github/ealenn/mExport?style=for-the-badge&logo=codecov)](https://codecov.io/gh/Ealenn/mExport)
[![GitHub stars](https://img.shields.io/github/stars/Ealenn/mExport?style=for-the-badge&logo=github)](https://github.com/Ealenn/mExport/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Ealenn/mExport?style=for-the-badge&logo=github)](https://github.com/Ealenn/mExport/issues)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/ealenn/mExport?style=for-the-badge)

![](./preview.png)

> [GitHub](https://github.com/Ealenn/mExport) - [NPM](https://www.npmjs.com/package/mexport) - [DockerHub](https://hub.docker.com/r/ealen/mexport)

mExport is a command line interface (CLI) for processing and sorting emails.

- Display precise statistics on your emails 
- Easily unsubscribe from mailing lists

## Installation

![Windows](https://img.shields.io/badge/-Windows-grey?style=flat&logo=windows)
![MacOs](https://img.shields.io/badge/-Mac-grey?style=flat&logo=apple)
![Linux](https://img.shields.io/badge/-Linux-grey?style=flat&logo=linux)
![Docker](https://img.shields.io/badge/-Docker-grey?style=flat&logo=docker)

Available for **Windows**, **MacOs** and **Linux** with **NodeJS** 
``` bash
npm i -g mexport@VERSION
```
[See available version](https://www.npmjs.com/package/mexport?activeTab=versions)

---

Or with **Docker** *(linux/amd64, linux/arm/v6, linux/arm/v7)*
``` bash
docker run --rm -v ${PWD}/mexport:/data ealen/mexport:VERSION --help
```
[See available version](https://hub.docker.com/r/ealen/mexport/tags)

You can also create an alias
``` bash
alias mexport='docker run --rm -v /tmp/mexport:/data ealen/mexport:latest'
```
---

## Getting Started

### Login to Servers

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

### Synchronize

``` bash
mexport synchronize
```

### Dashboard

``` bash
mexport dashboard
```

``` bash
# Example
cd ~
mkdir mexport-dashboard
mexport dashboard -p $PWD/mexport-dashboard
```

## Development

``` bash
node ./dist/Main.js [command]
```

### NPM Scripts

- `build`: Build project
- `build:watch` : Hot-Reload build

- `local`: Install mexport with local project
- `test`: Run tests with code coverage

- `docker:run`: Run mexport **dev** tag container with interactive flag
- `docker:build`: Build mexport Docker Image with **dev** tag
