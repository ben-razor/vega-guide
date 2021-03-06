# Vega Guide

This repository explores [Vega Protocol](https://vega.xyz/) as part of the [Gitcoin GR11 Hackathon](https://gitcoin.co/issue/vegaprotocol/bounties/11/100026491).

Vega Protocol is a decentralized platform for trading derivatives.

This project creates applications and associated documentation to guide a new user in using the Vega Protocol with GraphQL. The submission includes:

* A [Vega Protocol GraphQL Walkthrough Application](https://vega-walkthrough.web.app/)
* A Vega Protocol [GraphQL in ReactJS Tutorial](https://vega-step-by-step.web.app/docs/vega/vega-react/) and an online demo of the [ReactJS Starter Application](https://vega-react.web.app/)
* A [Documentation Book](https://vega-step-by-step.web.app/docs/vega/) explaining the tutorial applications

## About This Document

This document is the how and why for creating the guides. The documentation for the guides themselves can be found in the [Vega GraphQL Guides](https://github.com/ben-razor/vega-guide/tree/main/GraphQL-Guides).

## Requirements

Detailed requirements are given in the [Gitcoin Bounty](https://gitcoin.co/issue/vegaprotocol/bounties/11/100026491). Important requirements used in this application are summarised here:

* Design and create a great **showcase** or **walk-through** application
* Bonus points for a set of supporting markdown files that describe how the application works, primarily the queries made to Vega
* The [GraphQL playground](https://lb.testnet.vega.xyz/playground) should be referenced and described in the guides
* Code examples should link directly to an appropriate section in the reference docs (https://docs.testnet.vega.xyz/api/graphql/)

Essential Vega features to implement:

- Listing markets and market data (including market status)
- Streaming of orders and trades
- Party (trader) information for a given public key, including account balances and positions.
- Prepare and place an order on a market
- Streaming of events
- Governance proposals

## Signing Transactions

Reads against the Vega apis do not require authentication. Writes / Updates must be signed using the Vega Wallet.

There is an official guide for setting up a [Vega Wallet](https://docs.fairground.vega.xyz/docs/wallet/getting-started/).

## Vega Documentation

These guides extend the official [Vega Documentation](https://docs.fairground.vega.xyz/docs). Key to this is the [API Documentation](https://docs.fairground.vega.xyz/docs/apis/) which provides how to guides focussing on gRPC and Rest APIs.

## Vega Fairground

At the time of the hackathon, the network is running on testnet and there is a [web based playground app](https://fairground.wtf/).

## Vega GraphQL

A handy tool for exploring the GraphQL API is the [Vega GraphQL Playground](https://lb.testnet.vega.xyz/playground)

## GR11 Hackathon

The GraphQL guides are created for the [GraphQL Reference Applications](https://gitcoin.co/issue/vegaprotocol/bounties/11/100026491) bounties of the [GR11 Hackathon](https://gitcoin.co/hackathon/gr11/)
