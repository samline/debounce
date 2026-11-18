# Changelog

All notable changes to this package. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [semver](https://semver.org/).

## [1.0.2] - 2026-11-17

### Changed

- The package moved from the `samline/utils` monorepo to its own repository, [samline/debounce](https://github.com/samline/debounce). Homepage, repository and documentation links point to the package's own site.

## [1.0.1] - 2026-11-13

### Fixed

- Documentation only: the README follows the canonical @samline structure with links to the new website (Home, examples, docs and agent skill), and the package now ships LICENSE.md.

## [1.0.0] - 2026-11-12

### Added

- Move to the `samline/utils` monorepo and release 1.0.

  - New `throttle`, `rafThrottle` and React/Vue `useThrottledCallback`.
  - Every helper returns a function with `cancel()`, `flush()` and `pending()`. It forwards `this` and returns the last result.
  - `maxWait` lower than `wait` is now clamped to `wait`, and invalid waits become `0`.
  - Svelte `createDebouncedStore` fixes chained `update` calls and adds `flush()` and `cancel()`.
  - React `useDebouncedCallback` now follows changes to `wait` and options.
  - CommonJS build, minified browser bundle and `./browser` export. `createDebounce` is deprecated in favour of `debounce`.
