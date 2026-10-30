/**
 * Day 02: Async Dashboard
 * Fake microservices simulating remote job-portal APIs
 */

// 1. Fake services with setTimeout
const getProfile = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: 'Asha' });
    }, 300);
  });
};

const getJobs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['Frontend Engineer', 'Full Stack Developer', 'Cloud Architect']);
    }, 500);
  });
};

const getSalaryData = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject('Salary service down');
    }, 200);
  });
};

const timeout = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(`Timed out after ${ms} ms`);
    }, ms);
  });
};

// Helper to round elapsed milliseconds to the nearest 100 ms
const roundToNearest100 = (ms) => Math.round(ms / 100) * 100;

async function runDashboard() {
  // --- Step 1: Sequential Loading ---
  try {
    const startSeq = performance.now();
    const profile = await getProfile();
    const jobs = await getJobs();
    const elapsedSeq = roundToNearest100(performance.now() - startSeq);
    console.log(`Sequential: ${profile.name} with ${jobs.length} jobs in ~${elapsedSeq} ms`);
  } catch (err) {
    console.error('Sequential failed:', err);
  }

  // --- Step 2: Parallel Loading with Promise.all ---
  try {
    const startPar = performance.now();
    const [profile, jobs] = await Promise.all([getProfile(), getJobs()]);
    const elapsedPar = roundToNearest100(performance.now() - startPar);
    console.log(`Parallel: ${profile.name} with ${jobs.length} jobs in ~${elapsedPar} ms`);
  } catch (err) {
    console.error('Parallel failed:', err);
  }

  // --- Step 3: Promise.all fails fast when one service rejects ---
  try {
    await Promise.all([getProfile(), getJobs(), getSalaryData()]);
  } catch (err) {
    console.log(`Promise.all failed: ${err}`);
  }

  // --- Step 4: Promise.allSettled recovers all outcomes ---
  try {
    const results = await Promise.allSettled([
      getProfile(),
      getJobs(),
      getSalaryData()
    ]);
    const statuses = results.map((r) => r.status).join(', ');
    console.log(`allSettled: ${statuses}`);
  } catch (err) {
    console.error('allSettled failed:', err);
  }

  // --- Step 5: Promise.race with timeout(400) against jobs (500 ms) ---
  try {
    await Promise.race([getJobs(), timeout(400)]);
  } catch (err) {
    console.log(`race: ${err}`);
  }

  // --- Step 6: Promise.race with timeout(400) against profile (300 ms) ---
  try {
    const firstResolved = await Promise.race([getProfile(), timeout(400)]);
    console.log(`race: ${firstResolved.name} arrived first`);
  } catch (err) {
    console.log(`race: ${err}`);
  }
}

// Run the dashboard if executed directly
if (require.main === module) {
  runDashboard();
}

module.exports = {
  getProfile,
  getJobs,
  getSalaryData,
  timeout,
  runDashboard
};
