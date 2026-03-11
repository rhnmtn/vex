import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to the admin dashboard'
};

export default function HomePage() {
  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        {/* Hero */}
        <div className='mb-12 text-center'>
          <h1 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
            Welcome
          </h1>
          <p className='text-muted-foreground mt-4 text-lg'>
            Admin dashboard starter built with Next.js and shadcn/ui
          </p>
          <div className='mt-8 flex justify-center gap-4'>
            <Button asChild size='lg'>
              <Link href='/dashboard/overview'>Go to Dashboard</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/about'>About</Link>
            </Button>
          </div>
        </div>

        {/* Content Sections */}
        <div className='space-y-8'>
          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>
              Overview
            </h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              This is a production-ready admin dashboard template built with
              modern web technologies. It provides a solid foundation for
              building powerful admin interfaces, SaaS applications, and
              internal tools.
            </p>
          </section>

          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>
              Features
            </h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              Analytics overview with charts, data tables with search and
              filtering, multi-theme support, and a feature-based folder
              structure designed for scalability. Explore the dashboard to
              discover all capabilities.
            </p>
          </section>

          <section className='bg-card rounded-2xl border p-8 shadow-sm'>
            <h2 className='text-foreground mb-4 text-xl font-semibold'>
              Tech Stack
            </h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and
              shadcn/ui components. The project follows best practices for
              performance, accessibility, and maintainability.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
