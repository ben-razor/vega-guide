# Documentation for Vega Protocol Applications

A collection of documentation for applications that interact with the [Vega Protocol](https://vega.xyz/) decentralized derivatives trading platform.

## Documenting This Guide

Documentation will follow the style of the [Vega Protocol documentation](https://docs.fairground.vega.xyz/).

From the source for those docs:

```
Made with Book Theme
https://github.com/alex-shpak/hugo-book
```

### Hugo

The documentation was created using the [Hugo](https://gohugo.io/) static site generator.

First install Hugo using instructions from [Hugo Installation](https://gohugo.io/getting-started/installing)

On Linux it was installed using snap:
```
sudo apt install snapd
snap install hugo --channel=extended
```

:warning: When using snaps, Hugo must be installed below the Home directory to avoid "permission denied". 

To create a new site using [https://github.com/alex-shpak/hugo-book](https://github.com/alex-shpak/hugo-book):

```bash
hugo new site step-by-step; cd step-by-step
git submodule add https://github.com/alex-shpak/hugo-book themes/book
cp -R themes/book/exampleSite/content .
```
The server is then started to view the documentation:
```
hugo server --minify --theme book
```
