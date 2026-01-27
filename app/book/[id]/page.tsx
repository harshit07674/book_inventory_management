'use client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { bookService } from '../../services/bookService';
import { Book } from '../../types/book';

// Since this is a server component by default in Next.js app dir (unless 'use client'),
// we can fetch data directly if we want, OR use client side fetching.
// Given strict "fetch book data dynamically from an API" requirement, 
// and that I set up internal API routes, I can fetch from them via http or import db directly.
// Importing db directly is better for Server Components performance (no self-request).
// BUT, the prompt implies "API Integration" explicitly.
// So I will use a client component for consistency with the "web app" feel and the service I created,
// OR keep it server-side but fetch from the absolute URL of the app (which is tricky in build).
// I will use 'use client' for the page to reuse the `bookService` easily without worry about host URLs.



import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BookDetailsPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchBookDetails(id);
        }
    }, [id]);

    const fetchBookDetails = async (bookId: string) => {
        try {
            setIsLoading(true);
            const data = await bookService.getBookById(bookId);
            setBook(data);
        } catch (err) {
            console.error(err);
            setError('Book not found or failed to load.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold">{error || 'Book not found'}</h1>
                    <Link href="/" className="text-primary hover:underline">
                        &larr; Back to Inventory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-8 py-12 max-w-screen-lg animate-fade-in">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    &larr; Back to Inventory
                </Link>

                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                    <div className="bg-primary/5 p-8 border-b border-border/50">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                            {book.title}
                        </h1>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:text-base text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">Author:</span> {book.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">Publisher:</span> {book.publisher}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">Published:</span> {book.publishedDate}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Overview</h3>
                                    <p className="leading-relaxed text-muted-foreground">
                                        {book.overview}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-xl bg-muted/50 p-6 space-y-4">
                                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Details</h4>
                                    <dl className="space-y-3 text-sm">
                                        <div className="flex justify-between border-b pb-2 border-border/50">
                                            <dt className="text-muted-foreground">Pages</dt>
                                            <dd className="font-medium">{book.pageCount}</dd>
                                        </div>
                                        <div className="flex justify-between border-b pb-2 border-border/50">
                                            <dt className="text-muted-foreground">Contact</dt>
                                            <dd className="font-medium truncate text-right w-[70%] md:w-[50%">{book.authorEmail}</dd>
                                        </div>
                                        <div className="flex justify-between border-b pb-2 border-border/50">
                                            <dt className="text-muted-foreground">ID</dt>
                                            <dd className="font-medium font-mono text-xs">{book.id}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
