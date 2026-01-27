import fs from 'fs/promises';
import path from 'path';
import { Book } from '../types/book';

const dataFilePath = path.join(process.cwd(), 'data', 'books.json');

export async function getBooks(): Promise<Book[]> {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array or seed data
        return [];
    }
}

export async function saveBooks(books: Book[]): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(books, null, 2));
}

export async function getBookById(id: string): Promise<Book | undefined> {
    const books = await getBooks();
    return books.find((book) => book.id === id);
}

export async function addBook(book: Book): Promise<Book> {
    const books = await getBooks();
    const newBook = { ...book, id: Date.now().toString() }; // Simple ID generation
    books.push(newBook);
    await saveBooks(books);
    return newBook;
}

export async function updateBook(id: string, updatedBook: Partial<Book>): Promise<Book | null> {
    const books = await getBooks();
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return null;

    books[index] = { ...books[index], ...updatedBook };
    await saveBooks(books);
    return books[index];
}

export async function deleteBook(id: string): Promise<boolean> {
    const books = await getBooks();
    const filteredBooks = books.filter((b) => b.id !== id);
    if (books.length === filteredBooks.length) return false;

    await saveBooks(filteredBooks);
    return true;
}
