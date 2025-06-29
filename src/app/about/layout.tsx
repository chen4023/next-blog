import { ReactNode } from 'react';
import Link from 'next/link';
import { UserRound, FolderGit2, Github } from 'lucide-react';

interface AboutLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: UserRound, label: 'Profile', href: '/about' },
  { icon: FolderGit2, label: 'Projects', href: '/about/projects' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/chen4023', external: true },
];

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <div className="container py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <nav className="sticky top-8 border border-gray-200 rounded-lg p-4 bg-white">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="prose prose-gray max-w-none">{children}</div>
        </main>
      </div>
    </div>
  );
}
