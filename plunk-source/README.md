# Plunk Source

A easy-to-use source embedder for [Plunker](http://plnkr.co) plunks.

## Preface

Implemented with `angular-highlightjs`, based on the idea of [plunk v3Mz2](http://plnkr.co/edit/v3Mz2C?p=preview).

## Usage

#### Syntax

```
http://pc035860.github.io/angular-highlightjs/plunk-source/#/{plunk-id}/{highlight-theme-name}
```

* `plunk-id` - {string} - Plunk ID. (`OPxzDu` of http://plnkr.co/edit/OPxzDu?p=preview)
* `highlight-theme-name` - {string} - Choose from any highlight theme available at [highlight.js git repo](https://github.com/isagalaev/highlight.js/tree/master/src/styles). (optional, default `default`)

#### Embed as an iframe

It's required to specify `width` and `height` attribute.

```html
<iframe src="http://pc035860.github.io/angular-highlightjs/plunk-source/#/OPxzDu" width="800" height="500"></iframe>
```

## Todo

* script file for embedding
* support auto-grow iframe when using script embedding
