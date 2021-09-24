---
weight: 1
bookFlatSection: true
title: "Introduction"
---

# Vega Step by Step using GraphQL

## Introduction 

This guide will take you step-by-step through how to interact with Vega using GraphQL.

Example applications will guide you from simple market data exploration to Vega Protocol mastery using GraphQL. There are two resources provided:

The [Vega GraphQL Walkthrough](https://vega-walkthrough.web.app/) application.

The [Vega GraphQL React Starter]({{< relref "/docs/vega/vega-react.md" >}}) tutorial.

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
