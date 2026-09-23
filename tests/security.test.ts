import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { NextRequest } from 'next/server';
import { createMarkerPopup, markerDay } from '../src/lib/map/popup';
import { isValidTripRequest } from '../src/lib/ai/requestValidation';
import { saveTripToMemory, getTripFromMemory } from '../src/lib/db/trips';
import { GET, POST } from '../src/app/api/trips/route';
import { POST as planTrip } from '../src/app/api/plan/route';
import type { MapMarker, TripPlan } from '../src/lib/ai/types';

test('popup fields are literal text, including hostile marker type and day', () => {
  const dom = new JSDOM();
  const payload = '<img src=x onerror="alert(1)"><svg onload="alert(1)">';
  const marker = { title: payload, description: payload, type: payload, day: payload } as unknown as MapMarker;
  const popup = createMarkerPopup(dom.window.document, marker);
  assert.equal(popup.querySelector('img, svg, script'), null);
  assert.equal(popup.children[1].textContent, payload);
  assert.equal(popup.children[2].textContent, payload);
  assert.equal(markerDay(payload), undefined);
  assert.equal(markerDay(2), 2);
  dom.window.close();
});

test('trip enumeration and arbitrary writes are disabled', async () => {
  for (const handler of [GET, POST]) {
    const response = handler();
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal((await response.json()).trips, undefined);
  }
});

test('invalid request shapes and unbounded preferences are rejected', () => {
  const invalid = [null, [], {}, { prompt: ' ' }, { prompt: 'a'.repeat(4001) },
    { prompt: 'Trip', durationDays: 0 }, { prompt: 'Trip', durationDays: -1 },
    { prompt: 'Trip', durationDays: 1.5 }, { prompt: 'Trip', durationDays: 1e9 },
    { prompt: 'Trip', travelersCount: '3' }, { prompt: 'Trip', travelersCount: 101 },
    { prompt: 'Trip', budget: Infinity }, { prompt: 'Trip', budget: -1 },
    { prompt: 'Trip', vibes: 'Nature' }, { prompt: 'Trip', vibes: [null] },
    { prompt: 'Trip', origin: {} }, { prompt: 'Trip', pace: 'anything' }];
  for (const input of invalid) assert.equal(isValidTripRequest(input), false, JSON.stringify(input));
  assert.equal(isValidTripRequest({ prompt: 'Trip' }), true);
  assert.equal(isValidTripRequest({ prompt: 'Trip', durationDays: 30, travelersCount: 100, budget: 10000, vibes: ['Nature'] }), true);
});

test('malformed JSON and invalid API requests return 400 before provider use', async () => {
  for (const body of ['{', 'null', JSON.stringify({ prompt: 'Trip', durationDays: 999999 })]) {
    const request = new NextRequest('http://localhost/api/plan', { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });
    assert.equal((await planTrip(request)).status, 400);
  }
});

test('inherited object names cannot retrieve trips', () => {
  for (const id of ['__proto__', 'constructor', 'toString']) assert.equal(getTripFromMemory(id), null);
});

test('stored trips cannot be overwritten', () => {
  const original = { id: 'duplicate-test', title: 'Original' } as TripPlan;
  saveTripToMemory(original);
  assert.throws(() => saveTripToMemory({ ...original, title: 'Changed' }), /already exists/);
  assert.equal(getTripFromMemory(original.id)?.title, 'Original');
});

test('temporary storage expires trips after 24 hours', context => {
  context.mock.timers.enable({ apis: ['Date'], now: 2_000_000_000_000 });
  const plan = { id: 'expiration-test' } as TripPlan;
  saveTripToMemory(plan);
  assert.equal(getTripFromMemory(plan.id)?.id, plan.id);
  context.mock.timers.tick(24 * 60 * 60 * 1000);
  assert.equal(getTripFromMemory(plan.id), null);
});

test('temporary storage evicts oldest trips at capacity', () => {
  for (let i = 0; i <= 500; i++) saveTripToMemory({ id: `capacity-${i}` } as TripPlan);
  assert.equal(getTripFromMemory('capacity-0'), null);
  assert.equal(getTripFromMemory('capacity-500')?.id, 'capacity-500');
});
