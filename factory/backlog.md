# Backlog

`/factory next` builds the first unchecked item and checks it off with its job id.

- [x] Move the recommendations endpoint from `src/app/pages/api/recommendations.js` to an App Router route handler at `src/app/api/recommendations/route.js` (POST) so the search form's `/api/recommendations` call stops returning 404, and fix its `utils/mockData` import to match the `MockData.js` filename casing (001-app-router-api)
- [x] Replace the create-next-app defaults in the `layout.js` `metadata` export with the app's title ("Food Delivery Finder - UK") and description, and remove the no-op `next/head` block from `Index.js` (002-app-metadata)
- [x] Delete the unused Tailwind v3 `tailwind.config.js` (Tailwind v4 is configured in `globals.css`), including the stray `next.config` content pasted at its end (003-remove-tailwind-config)
- [x] Replace the `alert()` calls in `SearchForm` with inline field errors for a missing or invalid max budget, min budget greater than max, and no meal option selected (004-inline-form-errors)
- [x] Show an empty state with a suggestion to widen the budget or change meal options when a search returns zero recommendations, instead of rendering nothing (005-empty-state)
- [x] Validate the postcode on the server with a UK postcode lookup API (e.g. postcodes.io) and return a clear 400 error for postcodes that don't exist (006-server-postcode-validation)
- [x] Resolve the validated postcode to latitude/longitude on the server and compute each result's real `distance` in miles from it (007-postcode-distance)
- [x] Add a pluggable delivery-provider layer on the server with a shared result shape (`restaurantName, dishName, description, price, rating, reviewCount, deliveryTime, distance, platforms, categories, orderUrl, originalPrice, specialOffer`), with the current mock data as the first provider (008-provider-layer)
- [ ] Validate the recommendations request body on the server: `postcode` a string of bounded length, `budgetMin`/`budgetMax` finite numbers with 0 <= min <= max and a sane upper bound, `mealOptions` a short array of allowed option strings. Return a clear 400 for anything else (today a non-array `mealOptions` causes a 500), and pass only the normalised values to providers
- [ ] Harden the provider layer before real providers are added: `import 'server-only'` in `src/app/providers/`, a per-provider timeout so one hanging provider can't stall the request, treat a provider that resolves to a non-array as a failure, and have `toResult` treat provider data as untrusted (only `http(s)` `orderUrl` values, finite numbers for price/rating/distance, capped string lengths)
- [ ] Add per-IP rate limiting to `POST /api/recommendations` and a short in-memory cache for postcodes.io lookups, so the endpoint can't be used to flood postcodes.io or (later) paid provider and LLM calls
- [ ] Add a Deliveroo provider that fetches nearby dishes for the searched location into the shared result shape
- [ ] Add a Just Eat provider that fetches nearby dishes for the searched location into the shared result shape
- [ ] Add an Uber Eats provider that fetches nearby dishes for the searched location into the shared result shape
- [ ] Merge results from all providers, de-duplicate the same dish from the same restaurant into one item listing every platform it's on, and apply the budget and meal-option filters
- [ ] Rank the merged results with an LLM against the user's budget and meal preferences, falling back to the current rating/price score if the LLM call fails, and remove the simulated 2-second delay
- [ ] Set up a test runner and add tests for the postcode validator, the budget/meal filtering, and the ranking fallback
