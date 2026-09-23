# Groq setup

Use Node 24 and run `npm ci`.

Create `.env.local` in the repository root:

```dotenv
GROQ_API_KEY=your_private_groq_key
GROQ_MODEL=openai/gpt-oss-120b
```

Get your key from https://console.groq.com/keys. Keep it on the server; never use a NEXT_PUBLIC variable for it. `.env.local` is ignored by Git. Restart Next.js after changing environment settings.

Run `npm run dev`, or `npm run build` then `npm start`. Groq is the default provider. An absent/invalid key, quota limit, timeout, truncated result or invalid plan produces an explicit error, never a sample itinerary. For an intentional offline demonstration only, set `AI_PROVIDER=demo` and restart. Demo results are labelled.

The default model supports strict JSON schemas. Alternative GROQ_MODEL values must support strict structured output and the request parameters used here. Free accounts have model-specific request and token limits; long itineraries can exceed the completion budget. No automatic retries consume additional quota.

Generation uses two requests: extract explicit preferences, then generate an itinerary. Unspecified preferences use visible API defaults (INR, 20,000 group budget, four days and three travelers). An unspecified origin is labelled as such. Every scheduled cost is per person; totals and a 5% contingency are calculated in code. Over-budget plans and mismatched days are rejected rather than cosmetically repaired.

Travel details remain AI estimates. Coordinates are approximate, routes are not verified, and no safety scores, live forecasts, hotel availability or emergency contacts are invented. Recommendations appear in the itinerary; separate hotel/food catalog cards are omitted for AI plans.

Validation: `npm test`, `npm run typecheck`, `npm run build`. Tests mock the provider and do not spend API credits. A live smoke test requires a configured key.
