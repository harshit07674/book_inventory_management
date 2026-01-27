export interface Book {
    id: string;
    title: string;
    author: string;
    authorEmail: string; // Added for validation demo
    publisher: string;
    publishedDate: string;
    pageCount: number; // Added for int validation demo
    overview: string;
}
