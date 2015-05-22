# NHS Choices Style Toolkit

This provides a **pattern library** for interface elements for the NHS site. It 
includes markup, CSS (based on Bootstrap, built using Less), and (eventually) 
JavaScript. It's intended to be a resource for designers and developers, and a central hub for our front-end site components.

The www directory can be served as a static site. It's built using the static 
site-generator functionality of Harp.

## Development notes

**Warning** -- the contents of the www directory will get overwritten by Harp 
during the build process. Everything that needs to persist needs to live in 
_source (from there, it'll get copied into www).

### Prerequisites for development:

- [node.js](https://nodejs.org/)
- [harp server](http://harpjs.com/)

### Building

To build, run this at the root directory:

    npm run build
	
To serve the site locally without building it, run this (with your choice of 
port number):

    harp server _source --port 8000
