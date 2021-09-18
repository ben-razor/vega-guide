# Documentation for Vega Protocol Applications

A collection of documentation for applications that interact with the [Vega Protocol](https://vega.xyz/) decentralized derivatives trading platform.

At present this consists of [Vega Step by Step using GraphQL](https://vega-step-by-step.web.app/)

The source for the documentation can be found in [step-by-step](https://github.com/ben-razor/vega-guide/tree/main/GraphQL-Guides/docs/step-by-step).

This document explains how the documentation was created.

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

### Hugo

The documentation will be hosted using [Firebase](https://firebase.google.com/).

Sign up for an account and create a project. We created a project called **vega-step-by-step** and followed the instructions to [host a Hugo site on Firebase](https://gohugo.io/hosting-and-deployment/hosting-on-firebase/).

:warning: The deploy command must be changed to deploy using the book theme:
```
hugo --theme book && firebase deploy --only hosting
```

The deployed documentation is now available at [https://vega-step-by-step.web.app/](https://vega-step-by-step.web.app/)
