# ORES OTEL marketing site

Astro source for [https://ores-otel.github.io/](https://ores-otel.github.io/).

Polyglot structured logging, trace correlation, bounded serialization, redaction, and injectable telemetry transports.

## Product boundary

ORES OTEL is an adapter and contract layer. It does not install global providers or operate an observability backend.

## Local validation

```sh
npm ci --ignore-scripts
npm test
npm run check
npm run build
```

GitHub Pages publishes only the tested `dist/` artifact from `main`. Dependencies are locked and all third-party workflow actions are pinned to immutable commits.
