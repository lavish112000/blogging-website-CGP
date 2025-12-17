/**
 * Admin Analytics Dashboard Widget
 * Shows article performance metrics inside CMS
 */

(function() {
  'use strict';

  // Fetch analytics data
  async function loadAnalytics() {
    try {
      const response = await fetch('/api/views');
      const data = await response.json();

      console.log('📊 Article Analytics:', data);
      console.log('Total Views:', data.total);
      console.log('Total Articles:', data.articles);

      // Display top performing articles
      if (data.views) {
        console.log('\n🏆 Top Performing Articles:');
        const topArticles = Object.entries(data.views).slice(0, 10);
        topArticles.forEach(([slug, views], index) => {
          console.log(`${index + 1}. ${slug}: ${views} views`);
        });
      }

      // You can extend this with UI elements when needed
      return data;
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }

  // Auto-load analytics when admin dashboard loads
  if (window.CMS) {
    window.CMS.registerEventListener({
      name: 'prePublish',
      handler: ({ entry }) => {
        console.log('Publishing article:', entry.get('data').get('title'));
        return Promise.resolve();
      }
    });
  }

  // Load analytics on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAnalytics);
  } else {
    loadAnalytics();
  }

  // Expose globally for manual access
  window.TechKnowlogiaAnalytics = {
    load: loadAnalytics,
    refresh: loadAnalytics
  };

  console.log('✅ Analytics widget loaded. Use TechKnowlogiaAnalytics.load() to refresh.');
})();
