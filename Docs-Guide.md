# Documenting This Guide

Documentation will follow the style of the [Vega Protocol documentation](https://docs.fairground.vega.xyz/).

From the source for those docs:

```
Made with Book Theme
https://github.com/alex-shpak/hugo-book
```

## Hugo

[Hugo](https://gohugo.io/) static site generator.

To create a new site using [https://github.com/alex-shpak/hugo-book](https://github.com/alex-shpak/hugo-book):

```bash
hugo new site mydocs; cd mydocs
git init
git submodule add https://github.com/alex-shpak/hugo-book themes/book
cp -R themes/book/exampleSite/content .

hugo server --minify --theme book
```
