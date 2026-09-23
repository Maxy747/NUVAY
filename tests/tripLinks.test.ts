import assert from 'node:assert/strict';
import { test } from 'node:test';
import { copyTripLink, loadTrip } from '../src/lib/tripLinks';
import type { TripPlan } from '../src/lib/ai/types';

const saved = { id: 'saved-trip', title: 'My trip' } as TripPlan;
const responseFetch = (body: unknown, status = 200): typeof fetch => async () => Response.json(body, { status });

test('missing trips return null without generating another plan', async () => {
  const calls: string[] = [];
  const fetchTrip: typeof fetch = async url => {
    calls.push(String(url));
    return Response.json({ error: 'Trip not found' }, { status: 404 });
  };
  assert.equal(await loadTrip('missing', fetchTrip, () => []), null);
  assert.deepEqual(calls, ['/api/trips/missing']);
});

test('saved local trips load when the server is offline or returns 404', async () => {
  const offline: typeof fetch = async () => { throw new Error('Offline'); };
  for (const fetchTrip of [offline, responseFetch({}, 404)]) {
    assert.equal(await loadTrip(saved.id, fetchTrip, () => [saved]), saved);
  }
});

test('server responses must match the requested trip', async () => {
  assert.equal(await loadTrip('different', responseFetch({ trip: saved }), () => []), null);
  assert.deepEqual(await loadTrip(saved.id, responseFetch({ trip: saved }), () => []), saved);
});

test('sharing copies the trip detail URL and awaits the clipboard', async () => {
  let copied = '';
  await copyTripLink(saved.id, 'https://nuvay.example', responseFetch({ trip: saved }), async text => { copied = text; });
  assert.equal(copied, 'https://nuvay.example/trip/saved-trip');
});

test('expired links and clipboard failures are reported', async () => {
  let writes = 0;
  await assert.rejects(copyTripLink(saved.id, 'https://nuvay.example', responseFetch({}, 404), async () => { writes++; }), /expired/);
  assert.equal(writes, 0);
  await assert.rejects(copyTripLink(saved.id, 'https://nuvay.example', responseFetch({ trip: saved }), async () => { throw new Error('Clipboard denied'); }), /Clipboard denied/);
});
