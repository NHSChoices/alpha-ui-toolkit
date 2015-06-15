# NHS Choices Style Toolkit

This provides a **pattern library** for interface elements for the NHS site. It includes markup, CSS (based on Bootstrap, built using Less), and (eventually) JavaScript. It's intended to be a resource for designers and developers, and a central hub for our front-end site components.

The www directory can be served as a static site. It's built using the static site-generator functionality of Harp.

## Development notes

**Warning** -- the contents of the www directory will get overwritten by Harp during the build process. Everything that needs to persist needs to live in _source (from there, it'll get copied into www).

### Prerequisites for development:

- [node.js](https://nodejs.org/)
- [harp server](http://harpjs.com/)

### Building

To build, run this at the root directory:

    npm run build

To serve the site locally without building it, run this (with your choice of port number):

    harp server _source --port 8000


## Add repository to .net project

If you want to include the ui-toolkit code within a .net project the steps below can be followed to add the repository as a git-submodule:

* Use [git-submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to include the repo.
* Install [dotless](http://www.dotlesscss.org/) NuGet package.
* Add pre-build events to the web project to copy assets from the submodule into the web project. Assets to be copied include the fonts, images and javascript files.
* Add a pre-build event to use the dotless compiler contained in the dotless NuGet package to compile the `.less` assets into the web project.
* Update `BundleConfig.cs` to bundle the neccessary `.css` and `.js` files for use in the website.

The dotless NuGet package can be used to serve `.less` assets in a [number](https://github.com/dotless/dotless/wiki/Using-.less) of ways. Using the executable to pre-compilie assets makes the most sense in the scenario of including the ui-toolkit repo in another project (where the assets are effectively unchanging once they are included).

An example set of pre-build events used in the conditions application can be see in the [`csproj`](https://github.com/NHSChoices/alpha-conditions/commit/a61e49f4043421224b47af3f12582a60e36e1da2#diff-c5f90130e3cde63c6d455b490643228dR447) file.