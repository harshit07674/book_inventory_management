'use client';

import Link from 'next/link';
import { Book } from '../types/book';

interface BookListProps {
    books: Book[];
    onDelete: (id: string) => void;
    onEdit: (book: Book) => void;
}

export default function BookList({ books, onDelete, onEdit }: BookListProps) {
    if (books.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed border-muted-foreground/25 bg-muted/50">
                <h3 className="text-lg font-semibold">No books found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Your inventory is empty. Add a new book to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-slide-up">
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 sm:hidden gap-4">
                {books.map((book) => (
                    <div key={book.id} className="bg-card rounded-xl border shadow-sm p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <Link href={`/book/${book.id}`} className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                                    {book.title}
                                </Link>
                                <p className="text-sm text-muted-foreground">{book.author}</p>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                {new Date(book.publishedDate).getFullYear()}
                            </span>
                        </div>

                        <div className="text-sm text-muted-foreground line-clamp-2">
                            {book.overview}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div className="text-xs font-medium text-muted-foreground">
                                {book.publisher}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(book)}
                                    className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Are you sure you want to delete this book?')) {
                                            onDelete(book.id);
                                        }
                                    }}
                                    className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-transparent bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground h-8 px-3 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block rounded-md border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Title</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Author</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden md:table-cell">Publisher</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden sm:table-cell">Year</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {books.map((book) => (
                                <tr
                                    key={book.id}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        <Link href={`/book/${book.id}`} className="hover:text-primary transition-colors block">
                                            {book.title}
                                        </Link>
                                    </td>
                                    <td className="p-4 align-middle">{book.author}</td>
                                    <td className="p-4 align-middle hidden md:table-cell">{book.publisher}</td>
                                    <td className="p-4 align-middle hidden sm:table-cell">
                                        {new Date(book.publishedDate).getFullYear()}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(book)}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Are you sure you want to delete this book?')) {
                                                        onDelete(book.id);
                                                    }
                                                }}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-transparent bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground h-8 px-3"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
