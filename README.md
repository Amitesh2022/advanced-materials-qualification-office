# Advanced Materials Qualification Office

## One-sentence benefit

Help European laboratories and manufacturers turn advanced-material evidence into confident industrial qualification decisions.

## Live demo

[Watch the workflow](docs/demo.webm).

## Screenshots

![Advanced materials qualification dashboard](docs/screenshot.png)

## Main features

- Search and sort qualification files by material, laboratory, owner or status.
- Create validated files with accountable teams and priorities.
- Advance work through draft, review and approved states.
- Show loading, empty, error and success feedback.
- Use operational and purpose routes responsively.

## Technology used

React, TypeScript, TanStack Query, Wouter, Vite, Spring Boot and Java 21.

## Installation instructions

Install Node.js 22 and Java 21. Run `npm install`, start `cd backend && mvn spring-boot:run`, then run `npm run dev`.

## Commercial licensing/contact

Commercial licensing and integration support are available through the repository contact options.

## Business problem and users

Research organisations, material suppliers, manufacturers and assurance teams need a shared view of test evidence, production readiness and circularity requirements.

## Key workflows

Find a material, create a qualification file, assign an owner, advance it after evidence review and confirm the API result.

## React framework highlights

TanStack Query manages server state, Wouter provides routes and typed forms perform real API writes.

## Java backend highlights

Spring Boot exposes validated list, search, create and update APIs, clear errors, health status and service tests.

## Architecture and state flow

React calls `/api/items`; Java validates requests, applies transitions and returns updated records.

## Accessibility and responsive behaviour

Semantic landmarks, labels, focus states and responsive cards support keyboard and multiple screen sizes.

## Verification commands

Run `npm test`, `npm run lint`, `npm run build`, `cd backend && mvn test` and `cd backend && mvn package`.

## Structure

`src` contains React, `backend` contains Java and `docs` contains inspected media.

## Tradeoffs

In-memory records simplify local use; production needs authentication, persistence and laboratory evidence integrations.

## Roadmap

Add test protocols, evidence attachments, sector profiles, approvals and multilingual reports.
