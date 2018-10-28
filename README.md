# npm-analyze
CLI tool to analyze the content, or the dependencies of your project. Can show you the files that would clutter your npm package with unused files, or you can use it to take a look in your dependencies, and see how much extra space they use of similar files.

## Installation

```
npm install -g npm-analyze
```

## Usage

**For your own package**

Just run the command in the folder you wish to check:

```
$ npm-analyze
```

**Other deps, in your project**

This will analyze your project for files not explicitly related to the functionality for your package and show you everything that should not be part of an npm package.

```
$ npm-analyze --deps
```

Depending on the size of the project this may take a while, but it will show you some stats like this:

![npm-analyze result](https://raw.githubusercontent.com/necccc/npm-analyze/master/example/result.png)
