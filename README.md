# SpaceX Launches

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

Showcase single-page React app to list launch data from the [r/spacex API](https://github.com/r-spacex/SpaceX-API). Bootstrapped with [Create React App](https://github.com/facebook/create-react-app), powered by [SWR](https://swr.vercel.app/), and tested with [Testing Library](https://testing-library.com/) and [Mock Service Worker](https://mswjs.io/).

## Background

I built this app to satisfy the following user stories:

> - As a user, I want the ability to load the full list of SpaceX launches from the SpaceX API ([PR #1](https://github.com/DavidJones418/cra-rockets/pull/1/files))
> - As a user, I want the ability to reload the data to see any new changes ([PR #2](https://github.com/DavidJones418/cra-rockets/pull/2/files))
> - As a user, I want the ability to filter the launch list by year ([PR #3](https://github.com/DavidJones418/cra-rockets/pull/3/files))
> - As a user, I want the ability to sort all launches by date (ascending/descending) ([PR #4](https://github.com/DavidJones418/cra-rockets/pull/4/files))

The visual design is based on a static mockup and was implemented in [PR #5](https://github.com/DavidJones418/cra-rockets/pull/5).

## Approach

This project should mostly follow expectations for a Create React App v4 codebase. Most of the application logic lies in [src/App.tsx](src/App.tsx); for a more complex application I would typically break out components (such as [src/Launch.tsx](src/Launch.tsx)) and custom hooks as patterns in presentation and business logic emerge.

### Fetching resources

The [stale-while-revalidate](https://tools.ietf.org/html/rfc5861#section-3) pattern is used via the [`swr`](https://www.npmjs.com/package/swr) package to keep the launches and rocket data current based on user activity. A refresh button is included as per the design, but mostly just provides reassurance. `swr` manages state and handles network errors, leaving [very little application code](src/App.tsx#L12-L20) for state management.

### Testing

I create a simplified mock of the API in [src/App.test.tsx](src/App.test.tsx#L15) to avoid network calls during testing and initialize the app to a known state. This mock is intentionally basic and incomplete to allow the tests to focus on a single concept.

## Future directions

This is the product of an afternoon/evening and as such is not a polished piece of work. In particular:

- Testing is quite light and covers each of the acceptance criteria in isolation. Notably test coverage does not directly include display of the rocket name from a second API call, as this is part of the design but not the acceptance criteria. In a more complex application I would likely use [Cypress](https://www.cypress.io/) to run at least one end-to-end test in a real browser and allow visual inspection of the test run.
- The design matches the mockup well on medium-sized user agents, but falls apart a bit at narrow and wide viewports. This may be remedied by adjusting the [`grid-template`](/src/App.module.css#L6-L9) providing the overall layout of the app, and potentially adding `@media` breakpoints. This was considered out of scope of this project.
- As of writing, the app has a perfect Lighthouse score on Accessibility, Best Practices and SEO, but loses a few points on Performance due to [LCP](https://web.dev/lighthouse-largest-contentful-paint/). This can be partially mitigated in a SPA by [preloading resources](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) in modern browsers.
