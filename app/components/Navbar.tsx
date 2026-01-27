import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8 mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            BookNest
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* Add user profile or other links here if needed */}
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                        Inventory
                    </Link>
                </div>
            </div>
        </nav>
    );
}
