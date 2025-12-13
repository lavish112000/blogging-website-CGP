import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-xl gradient-text-primary">
                Tech-Knowlogia
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Premium insights for modern professionals. Explore web development, design, technology, lifestyle, and business.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@vibrantinsights.com"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-3">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Newsletter
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest articles and insights delivered to your inbox.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground flex items-center">
              © {currentYear} Tech-Knowlogia. Made with{' '}
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500" /> for knowledge seekers.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="/sitemap.xml"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sitemap
              </Link>
              <Link
                href="/rss.xml"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                RSS Feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
