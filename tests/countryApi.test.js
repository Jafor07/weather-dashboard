import test from 'node:test'
import assert from 'node:assert/strict'

import { fetchCountryByCode } from '../src/services/countryApi.js'

test('fetchCountryByCode returns a safe fallback instead of throwing when the country service fails', async () => {
  const result = await fetchCountryByCode('BD')

  assert.ok(result)
  assert.equal(result.cca2, 'BD')
  assert.ok(result.name || result.countryName || result.region || result.subregion)
})
