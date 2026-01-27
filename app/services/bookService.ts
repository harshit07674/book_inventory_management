import { Book } from '../types/book';

const API_BASE_URL = '/api/books';

export const bookService = {
    async getAllBooks(): Promise<Book[]> {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        return response.json();
    },

    async getBookById(id: string): Promise<Book> {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Book not found');
            }
            throw new Error('Failed to fetch book details');
        }
        return response.json();
    },

    async createBook(book: Omit<Book, 'id'>): Promise<Book> {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        });
        if (!response.ok) {
            throw new Error('Failed to create book');
        }
        return response.json();
    },

    async updateBook(id: string, book: Partial<Book>): Promise<Book> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        });
        if (!response.ok) {
            throw new Error('Failed to update book');
        }
        return response.json();
    },

    async deleteBook(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
    },
};
