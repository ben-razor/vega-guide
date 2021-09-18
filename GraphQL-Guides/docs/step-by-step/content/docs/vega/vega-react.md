---
weight: 1
bookFlatSection: true
title: "ReactJS Starter"
---

# ReactJS Starter Application

## Introduction 

This guide will take you through the creation of a basic application in ReactJS that interacts with the Vega Protocol using GraphQL.

The source for the application can be found at [vega-react](https://github.com/ben-razor/vega-guide/tree/main/GraphQL-Guides/apps/vega-react).

This guide is for those looking for a starting point to build ReactJS applications that use the Vega GraphQL API.

If you are looking for a platform agnostic step-by-step guide to using the Vega GraphQL API you can jump ahead to the [Vega GraphQL Walkthrough]({{< relref "/docs/example/vega-react-walkthrough.md" >}}).

## A Quick introduction to Vega Protocol

[Vega Protocol](https://vega.xyz/) is a decentralized derivatives trading platform.

A trading platform allows people to make agreements to trade assets when specified conditions such as price and timing are met. Derivatives are contracts whose value is based on underlying assets.

[Vega Protocol](https://vega.xyz/) is decentralized. Instead of using a centralized organisation like a bank or traditional exchange, a network of computers is used to verify trades and agreements between parties.

Each user has an identifier called a **public key**. Before a transaction is sent to the Vega network it is signed using a related **private key**. The public key, signed transaction, and previous transaction information are used by the network to ensure that the transaction is valid.

A **wallet** stores the keys and handles tasks such as signing transactions. 

## Prerequisites

#### Vega

Before using this guide check out the [Vega Documentation](https://docs.fairground.vega.xyz/).

To use Vega you first need to set up a [wallet](https://docs.fairground.vega.xyz/docs/wallet/).

You can try out Vega using on the web using the [Testnet Fairground Console](https://console.fairground.wtf/).

#### GraphQL

Open the [Vega GraphQL playground](https://lb.testnet.vega.xyz/playground). You can use it alongside this tutorial to explore the full Vega GraphQL API.
