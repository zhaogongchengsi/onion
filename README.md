# @zunh/onion

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

> A simple middleware onion model.

## Usage

```bash
npm install @zunh/onion
pnpm install @zunh/onion
yarn add @zunh/onion
```

```js
import Onion from '@zunh/onion';

const onion = new Onion();

onion.use(async (ctx, next) => {
  console.log('1');
  await next();
  console.log('2');
});

onion.use(async (ctx, next) => {
  console.log('3');
  await next();
  console.log('4');
});

onion.run();
```

## License

[MIT](./LICENSE) License © 2023-PRESENT [zhaozunhong](https://github.com/zhaozunhong)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@zunh/onion?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@zunh/onion
[npm-downloads-src]: https://img.shields.io/npm/dm/@zunh/onion?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@zunh/onion
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@zunh/onion?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@zunh/onion
[license-src]: https://img.shields.io/github/license/zhaozunhong/@zunh/onion.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/zhaozunhong/@zunh/onion/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@zunh/onion