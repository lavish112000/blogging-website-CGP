import Image from 'next/image'
import { User as UserIcon, Linkedin, Twitter, Mail } from 'lucide-react'

interface Author {
  name: string
  bio: string
  avatar?: string
  role?: string
  linkedin?: string
  twitter?: string
  email?: string
}

interface AuthorBioProps {
  author: Author
}

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-muted/30">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent-purple flex-shrink-0">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {author.name}
          </h3>
          {author.role && (
            <p className="text-sm text-primary font-medium mb-2">
              {author.role}
            </p>
          )}
          <p className="text-sm text-muted-foreground mb-3">
            {author.bio}
          </p>
          
          {(author.linkedin || author.twitter || author.email) && (
            <div className="flex items-center gap-3">
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {author.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
