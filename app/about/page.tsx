import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | Lalit Choudhary',
  description: 'Learn more about Lalit Choudhary, a Full Stack Web Developer.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
          <p className="text-xl text-muted-foreground">
            Passionate about building digital experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-xl">
            <Image
              src="/images/profile.jpg"
              alt="Lalit Choudhary"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Lalit Choudhary</h2>
              <p className="text-lg font-medium text-primary">Full Stack Web Developer</p>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                Hello! I&apos;m Lalit, a dedicated Full Stack Web Developer with a passion for creating 
                dynamic, responsive, and user-friendly web applications.
              </p>
              <p>
                With expertise in modern web technologies, I specialize in building scalable 
                solutions that solve real-world problems. My journey in tech is driven by 
                continuous learning and a desire to innovate.
              </p>
              <p>
                Whether it&apos;s crafting intuitive user interfaces or architecting robust backend 
                systems, I bring a holistic approach to web development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
