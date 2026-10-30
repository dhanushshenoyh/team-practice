/**
 * Dashboard Header Component
 * Renders title, real-time status indicator, and navigation
 */
function createHeader(userName = 'Asha') {
  return `
    <header class="dashboard-header">
      <div class="brand">
        <h1>TechCareer Portal</h1>
        <span class="badge">Live</span>
      </div>
      <div class="user-greeting">
        <span>Welcome back, <strong>${userName}</strong></span>
      </div>
    </header>
  `;
}

module.exports = { createHeader };
