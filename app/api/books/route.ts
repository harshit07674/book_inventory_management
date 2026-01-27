import { NextRequest, NextResponse } from 'next/server';
import { getBooks, addBook } from '../../lib/db';
import { Book } from '../../types/book';

export async function GET() {
    const books = await getBooks();
    return NextResponse.json(books);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Basic validation
        if (!body.title || !body.author) {
            return NextResponse.json({ error: 'Title and Author are required' }, { status: 400 });
        }

        const newBook = await addBook(body as Book);
        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
    }
}
