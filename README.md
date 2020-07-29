# `@vtex/babel-plugin-vtex-cms`

This package is a simple Babel plugin that performs some transformations on `tsx` code which are useful for VTEX CMS, such as removing `.displayName`s and `.schema`s assignments.

## Installation

Give that you already have `babel` installed, run:

```bash
yarn add -D @vtex/babel-plugin-vtex-cms
```

## Usage

After installing the module, add it to the `plugins` array in your project's `babel` configuration file:

```json
{
  "plugins": ["@vtex/babel-plugin-vtex-cms"]
}
```
