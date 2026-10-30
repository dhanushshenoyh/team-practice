/**
 * Dashboard Footer Component
 * Renders status alerts, service health indicators, and copyright
 */
function createFooter() {
  return `
    <footer class="dashboard-footer">
      <p class="service-notice">All microservices monitored: Profile, Jobs, Salary.</p>
      <p class="copyright">&copy; 2026 TechCareer Portal. Built with resilient async architecture.</p>
    </footer>
  `;
}

module.exports = { createFooter };
