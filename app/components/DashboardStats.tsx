import { Book } from '../types/book';

interface DashboardStatsProps {
    books: Book[];
}

export default function DashboardStats({ books }: DashboardStatsProps) {
    const totalBooks = books.length;

    const totalPages = books.reduce((acc, book) => acc + (book.pageCount || 0), 0);

    const uniqueAuthors = new Set(books.map(b => b.author)).size;

    const newestBookYear = books.length > 0
        ? Math.max(...books.map(b => new Date(b.publishedDate).getFullYear()))
        : '-';

    const stats = [
        { label: 'Total Books', value: totalBooks, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
        { label: 'Total Pages', value: totalPages.toLocaleString(), color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
        { label: 'Unique Authors', value: uniqueAuthors, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
        { label: 'Newest Release', value: newestBookYear, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in mb-8">
            {stats.map((stat, index) => (
                <div
                    key={stat.label}
                    className="bg-card border shadow-sm rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-md"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                        <div className={`h-2 w-2 rounded-full ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1].replace('text-', 'bg-')}`} />
                    </div>
                    <div className={`mt-3 h-1 w-full rounded-full ${stat.color.split(' ')[0]}`}>
                        <div className={`h-full rounded-full opacity-50 w-2/3 ${stat.color.split(' ')[1].replace('text-', 'bg-')}`} style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
