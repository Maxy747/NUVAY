import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GroqAIService, buildGroqPlan, AIProviderError } from '../src/lib/ai/groqProvider';
import { getAIService } from '../src/lib/ai';

const request = { prompt: 'One day in Mysore', durationDays: 1, budget: 10000, travelersCount: 2, origin: 'Bangalore' };
const draft = {
  title: 'Mysore day trip', tagline: 'Palaces and food', destination: 'Mysore', center: { lat: 12.3, lng: 76.6 },
  days: [{ day: 1, title: 'Explore Mysore', theme: 'Culture', schedule: [
    { time: '09:00', title: 'Travel to Mysore', description: 'Return transport estimate', location: 'Mysore', costPerPerson: 1000, category: 'travel', coordinates: null },
    { time: '12:00', title: 'Lunch', description: 'Local meal', location: 'City centre', costPerPerson: 200, category: 'food', coordinates: { lat: 12.3, lng: 76.6 } },
  ] }], localTips: ['Check opening hours.'],
};
const completion = (content: unknown, finish = 'stop') => Response.json({ choices: [{ finish_reason: finish, message: { content: JSON.stringify(content) } }] });

test('Groq sends strict schema to its API and produces a genuine provider label', async () => {
  const fakeFetch: typeof fetch = async (url, options) => {
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
    const body = JSON.parse(String(options?.body));
    assert.equal(body.model, 'openai/gpt-oss-120b');
    assert.equal(body.response_format.json_schema.strict, true);
    assert.equal(body.response_format.json_schema.schema.additionalProperties, false);
    assert.equal((options?.headers as Record<string, string>).Authorization, 'Bearer test-key');
    return completion(draft);
  };
  const plan = await new GroqAIService('test-key', 'openai/gpt-oss-120b', fakeFetch).generateTripPlan(request);
  assert.equal(plan.generation?.mode, 'ai');
  assert.match(plan.generation!.provider, /Groq/);
  assert.equal(plan.totalBudgetEstimate, 2520);
  assert.equal(plan.budgetBreakdown.transportation, 2000);
  assert.equal(plan.budgetBreakdown.food, 400);
  assert.equal(plan.budgetBreakdown.contingency, 120);
  assert.equal(plan.markers.length, 1);
  assert.equal(plan.safetyInfo.overallSafetyIndex, null);
  assert.deepEqual(plan.safetyInfo.emergencyContacts, []);
});

test('missing key never silently returns demo data', async () => {
  await assert.rejects(new GroqAIService('').generateTripPlan(request), (error: unknown) => error instanceof AIProviderError && error.status === 503);
});

test('rate limits, invalid keys, network and provider failures are actionable', async () => {
  for (const [status, expected] of [[429, 429], [401, 503], [403, 503], [500, 502]]) {
    const fakeFetch: typeof fetch = async () => Response.json({ secret: 'must not leak' }, { status });
    await assert.rejects(new GroqAIService('test-key', 'test-model', fakeFetch).generateTripPlan(request), (error: unknown) => {
      assert.ok(error instanceof AIProviderError);
      assert.equal(error.status, expected);
      assert.doesNotMatch(error.message, /must not leak|test-key/);
      return true;
    });
  }
  const offline: typeof fetch = async () => { throw new Error('network'); };
  await assert.rejects(new GroqAIService('key', 'model', offline).generateTripPlan(request), /timed out/);
});

test('invalid and truncated output is rejected instead of rendered', async () => {
  for (const response of [() => completion({}), () => completion(draft, 'length'), () => Response.json({ choices: [{ finish_reason: 'stop', message: { content: 'not json' } }] })]) {
    await assert.rejects(new GroqAIService('key', 'model', async () => response()).generateTripPlan(request), /incomplete or invalid/);
  }
});

test('budget excess, missing days and invalid coordinates are rejected', () => {
  assert.throws(() => buildGroqPlan(draft, { ...request, budget: 100 }, 'Groq'), /budget/);
  assert.throws(() => buildGroqPlan(draft, { ...request, durationDays: 2 }, 'Groq'), /requested days/);
  assert.throws(() => buildGroqPlan({ ...draft, center: { lat: 200, lng: 10 } }, request, 'Groq'));
});

test('preference extraction leaves absent values unspecified', async () => {
  const preferences = { budget: null, currency: null, durationDays: 1, travelersCount: null, travelerType: null, origin: 'Bangalore', vibes: null, pace: null, accommodationType: null };
  const service = new GroqAIService('key', 'model', async () => completion(preferences));
  assert.deepEqual(await service.parseNaturalPrompt('A day trip from Bangalore'), { durationDays: 1, origin: 'Bangalore' });
});

test('default provider is Groq; demo requires an explicit selection', context => {
  const old = process.env.AI_PROVIDER;
  context.after(() => { if (old === undefined) delete process.env.AI_PROVIDER; else process.env.AI_PROVIDER = old; });
  delete process.env.AI_PROVIDER;
  assert.ok(getAIService() instanceof GroqAIService);
  process.env.AI_PROVIDER = 'demo';
  assert.ok(!(getAIService() instanceof GroqAIService));
});
