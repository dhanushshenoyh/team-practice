/**
 * Day 02: Safe Fetch Implementation
 * Resilient fetch wrapper with AbortController timeout & HTTP status validation.
 */

/**
 * Executes a network fetch with a 5-second abort timeout and status verification.
 * Does not throw on network failure, abort, or 4xx/5xx status codes.
 *
 * @param {string} url - Target resource URL
 * @param {RequestInit} [options={}] - Standard fetch options
 * @returns {Promise<{ data: any, error: string | null }>}
 */
async function safeFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutMs = 5000;
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    // fetch() only rejects on network failures. 404 and 500 must be manually checked via res.ok
    if (!response.ok) {
      return {
        data: null,
        error: `HTTP Error ${response.status} (${response.statusText || 'Status Not OK'})`
      };
    }

    const contentType = response.headers.get('content-type') || '';
    let payload;
    if (contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      payload = await response.text();
    }

    return {
      data: payload,
      error: null
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      return {
        data: null,
        error: `Request timed out and aborted after ${timeoutMs}ms`
      };
    }

    return {
      data: null,
      error: err.message || 'Unknown network error'
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runTests() {
  console.log('--- Testing safeFetch(url) ---\n');

  // Test 1: Working URL
  console.log('1. Testing working URL (jsonplaceholder.typicode.com)...');
  const workingResult = await safeFetch('https://jsonplaceholder.typicode.com/todos/1');
  console.log('Result:', JSON.stringify(workingResult, null, 2));

  // Test 2: 404 URL
  console.log('\n2. Testing 404 URL (non-existent route)...');
  const notFoundResult = await safeFetch('https://jsonplaceholder.typicode.com/posts/99999999/not-found');
  console.log('Result:', JSON.stringify(notFoundResult, null, 2));

  // Test 3: Made-up domain
  console.log('\n3. Testing made-up domain (DNS failure)...');
  const invalidDomainResult = await safeFetch('https://this-domain-definitely-does-not-exist-xyz123.com');
  console.log('Result:', JSON.stringify(invalidDomainResult, null, 2));
}

if (require.main === module) {
  runTests();
}

module.exports = {
  safeFetch,
  runTests
};
