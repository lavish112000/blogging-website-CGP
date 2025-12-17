import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Tech-Knowlogia',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

/**
 * ADMIN DASHBOARD - MAIN PAGE
 * 
 * SECURITY: Protected by admin-dashboard/layout.tsx
 * NO PUBLIC ACCESS - Admin role required
 */
export default async function AdminDashboardPage() {
  // Fetch admin data (server-side)
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your private control center for Tech-Knowlogia
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Articles"
          value={stats.totalArticles}
          icon="📄"
          trend="+12% this week"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon="👁️"
          trend="+24% this week"
        />
        <StatCard
          title="Featured Posts"
          value={stats.featuredPosts}
          icon="⭐"
        />
        <StatCard
          title="Breaking News"
          value={stats.breakingNews}
          icon="🔴"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Articles */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Top Performing Articles</h2>
          <div className="space-y-3">
            {stats.topArticles.map((article, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-1">{article.title}</p>
                  <p className="text-xs text-muted-foreground">{article.category}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-primary">{article.views}</p>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Actions */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <ActivityItem
              action="Published"
              title="AI in Healthcare 2025"
              time="2 hours ago"
            />
            <ActivityItem
              action="Updated"
              title="Quantum Computing Guide"
              time="5 hours ago"
            />
            <ActivityItem
              action="Drafted"
              title="Sustainable Tech Trends"
              time="1 day ago"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton href="/admin" label="CMS Dashboard" icon="📝" />
          <QuickActionButton href="/admin-dashboard/ai-drafts" label="Generate Draft" icon="✨" />
          <QuickActionButton href="/admin-dashboard/breaking-news" label="Breaking News" icon="🚨" />
          <QuickActionButton href="/admin-dashboard/analytics" label="Analytics" icon="📊" />
        </div>
      </div>
    </div>
  )
}

// Server-side data fetching
async function getAdminStats() {
  // In production, fetch from database or API
  return {
    totalArticles: 47,
    totalViews: 12453,
    featuredPosts: 8,
    breakingNews: 2,
    topArticles: [
      { title: 'Sundar Pichai AI Jobs Warning', category: 'Technology', views: 2451 },
      { title: 'Digital Marketing 2025', category: 'Business', views: 1876 },
      { title: 'AI Trends 2025', category: 'Technology', views: 1632 },
      { title: 'Modern UI/UX Principles', category: 'Design', views: 1245 },
      { title: 'Future of Web Development', category: 'Blog', views: 1098 },
    ]
  }
}

// UI Components
function StatCard({ title, value, icon, trend }: { title: string, value: number, icon: string, trend?: string }) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && <span className="text-xs text-green-600 font-medium">{trend}</span>}
      </div>
      <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  )
}

function ActivityItem({ action, title, time }: { action: string, title: string, time: string }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b last:border-0">
      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{action}</span> {title}
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

function QuickActionButton({ href, label, icon }: { href: string, label: string, icon: string }) {
  return (
    <a
      href={href}
      className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 text-center transition-colors"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
    </a>
  )
}
