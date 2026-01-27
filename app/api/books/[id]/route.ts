import { NextRequest, NextResponse } from 'next/server';
import { getBookById, updateBook, deleteBook } from '../../../lib/db';
import { Book } from '../../../types/book';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const book = await getBookById(id);

    if (!book) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updatedBook = await updateBook(id, body as Partial<Book>);

        if (!updatedBook) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        return NextResponse.json(updatedBook);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const success = await deleteBook(id);

    if (!success) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book deleted successfully' });
}
