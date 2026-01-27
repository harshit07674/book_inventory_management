'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import DashboardStats from './components/DashboardStats';
import { bookService } from './services/bookService';
import { Book } from './types/book';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await bookService.deleteBook(id);
      setBooks(books.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Failed to delete book', error);
      alert('Failed to delete book');
    }
  };

  const handleCreateOrUpdate = async (bookData: Omit<Book, 'id'>) => {
    try {
      if (editingBook) {
        const updated = await bookService.updateBook(editingBook.id, bookData);
        setBooks(books.map((b) => (b.id === updated.id ? updated : b)));
      } else {
        const created = await bookService.createBook(bookData);
        setBooks([...books, created]);
      }
      setView('list');
      setEditingBook(undefined);
    } catch (error) {
      console.error('Failed to save book', error);
      alert('Failed to save book');
    }
  };

  const startEdit = (book: Book) => {
    setEditingBook(book);
    setView('form');
  };

  const startCreate = () => {
    setEditingBook(undefined);
    setView('form');
  };

  const cancelForm = () => {
    setEditingBook(undefined);
    setView('list');
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-8 py-8 max-w-screen-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {view === 'list' ? 'Library Inventory' : (editingBook ? 'Edit Book' : 'Add New Book')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {view === 'list'
                ? 'Manage your collection of books efficiently.'
                : 'Fill in the details below to update your inventory.'}
            </p>
          </div>

          {view === 'list' && (
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
              <div className="relative w-full sm:w-64">
                <svg
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="search"
                  placeholder="Search books..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={startCreate}
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 shadow-lg hover:shadow-primary/25 whitespace-nowrap"
              >
                + Add Book
              </button>
            </div>
          )}
        </div>

        {view === 'list' && <DashboardStats books={filteredBooks.length > 0 || searchQuery !== '' ? books : []} />}

        {/* Content Area */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : view === 'list' ? (
            <BookList books={filteredBooks} onDelete={handleDelete} onEdit={startEdit} />
          ) : (
            <div className="bg-card rounded-xl border shadow-sm p-6 sm:p-8">
              <BookForm
                initialData={editingBook}
                onSubmit={handleCreateOrUpdate}
                onCancel={cancelForm}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
