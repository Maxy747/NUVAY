# NuVay repair roadmap

This fork starts from upstream commit `841495907833700c4b7539eb467c6d2c91d2719f`.

## First batch: security and trip reliability

- Disable unauthenticated trip listing and arbitrary trip writes. The UI saves to localStorage; generation remains the server-side creation path.
- Assign server-generated UUIDs. Links act as bearer access: anyone holding a link can view the trip. This is not account-based privacy.
- Use inert DOM text for Leaflet popups, validate day labels and coordinates, and cancel pending map initialization on unmount.
- Bound explicit and parsed request preferences before itinerary generation.
- Copy the trip detail URL only after confirming availability; handle clipboard errors.
- Never generate a substitute trip for an expired link. Allow local saves to load while offline.
- Bound the temporary process store to 500 trips and 24 hours; reject overwrites and inherited-object lookups.

Run `npm test`, `npm run typecheck`, and `npm run build` for verification. The existing lint command requires tooling repair in a follow-up. Dependency installation and tests use Node 24.

## Next batches

1. Restore real AI generation: configurable supported Gemini model, server-only key, complete output schema, provider timeouts, and explicit demo/failure states. The current Gemini 1.5 model is shut down; the fallback can still conceal failure.
2. Validate itinerary feasibility and itemized budget totals. Remove cosmetic budget repair; missing days, unsupported destinations, and invalid provider output must not pass as successful plans.
3. Persistent database, accounts/ownership and explicit share records. The current process store can disappear on restart, differs between workers, and evicts old entries. Links are temporary; localStorage remains device-specific.
4. Request size limits and distributed rate limits before a public deployment; the current preference bounds are not an abuse-prevention system.
5. Ground location, route, opening-hours and price data. Remove invented coordinates and unsupported safety-verification claims.
6. Repair lint tooling, establish CI and add full browser coverage of generation, saving and sharing.

This first batch is not a production-readiness claim. No live Gemini request or deployment is required to run its regression tests.
