# NHS Choices Style Toolkit

This provides a **pattern library** for interface elements for the NHS site. It includes markup, CSS (based on Bootstrap, built using Less), and (eventually) JavaScript. It's intended to be a resource for developers, as a central hub for our front-end site components.

The root directory can be served as a static site (so it works on Github pages). It's built using the static site-generator functionality of Harp.

## Development notes

**Warning** -- the contents of the root directory will get overwritten by Harp during the build process. Everything that needs to persist needs to live in _harp (from there, it'll get copied up to the root).

### Prerequisites for development:

- [node.js](https://nodejs.org/)
- [harp server](http://harpjs.com/)

### Building

To build, run this at the root directory:

    harp compile _harp ./
	
To serve the site locally without building it, run this (with your choice of port number):

    harp server _harp --port 8001
