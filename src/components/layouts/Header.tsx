import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container flex h-[var(--header-height)] items-center">
        <Link href="/" className="text-xl font-semibold">
          <span className="font-bold">CHAE EUN</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/" className="hover:text-primary font-medium">
            Home
          </Link>
          <Link href="/blog" className="hover:text-primary font-medium">
            Blog
          </Link>
          <Link href="/about" className="hover:text-primary font-medium">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary font-medium">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
