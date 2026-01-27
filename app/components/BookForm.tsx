'use client';

import { useState, useEffect } from 'react';
import { Book } from '../types/book';

interface BookFormProps {
    initialData?: Book;
    onSubmit: (book: Omit<Book, 'id'>) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function BookForm({ initialData, onSubmit, onCancel, isLoading }: BookFormProps) {
    const [formData, setFormData] = useState<Omit<Book, 'id'>>({
        title: '',
        author: '',
        authorEmail: '',
        publisher: '',
        publishedDate: '',
        pageCount: 0,
        overview: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof Omit<Book, 'id'>, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof Omit<Book, 'id'>, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                author: initialData.author,
                authorEmail: initialData.authorEmail || '',
                publisher: initialData.publisher,
                publishedDate: initialData.publishedDate,
                pageCount: initialData.pageCount || 0,
                overview: initialData.overview,
            });
        }
    }, [initialData]);

    const validateField = (name: keyof Omit<Book, 'id'>, value: any): string => {
        let error = '';
        const strValue = String(value).trim();

        switch (name) {
            case 'title':
                if (!strValue) error = 'Title is required';
                break;
            case 'author':
                if (!strValue) error = 'Author is required';
                else if (!/^[a-zA-Z\s]*$/.test(strValue)) error = 'Author must contain only alphabets';
                break;
            case 'authorEmail':
                if (!strValue) error = 'Author Email is required';
                else if (!strValue.includes('@') || !strValue.includes('.')) error = 'Email must contain @ and .';
                break;
            case 'publisher':
                if (!strValue) error = 'Publisher is required';
                break;
            case 'publishedDate':
                if (!strValue) error = 'Published Date is required';
                break;
            case 'pageCount':
                if (!value) error = 'Page count is required';
                else if (isNaN(Number(value)) || !Number.isInteger(Number(value)) || Number(value) <= 0) error = 'Page count must be a positive integer';
                break;
            case 'overview':
                if (!strValue) error = 'Overview is required';
                break;
        }
        return error;
    };

    const handleBlur = (name: keyof Omit<Book, 'id'>) => {
        setTouched({ ...touched, [name]: true });
        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error || undefined }));
    };

    const handleChange = (name: keyof Omit<Book, 'id'>, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation if the field was touched or currently has an error
        if (touched[name] || errors[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error || undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof Omit<Book, 'id'>, string>> = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof Omit<Book, 'id'>>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Mark all fields as touched on submit
        const allTouched = (Object.keys(formData) as Array<keyof Omit<Book, 'id'>>).reduce((acc, key) => ({
            ...acc,
            [key]: true
        }), {});
        setTouched(allTouched);

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                pageCount: Number(formData.pageCount)
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = (error?: string) => `
    flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
    ${error ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-primary'}
  `;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title <span className="text-destructive">*</span></label>
                    <input
                        type="text"
                        className={inputClass(errors.title)}
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        onBlur={() => handleBlur('title')}
                        placeholder="Enter book title"
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Author <span className="text-destructive">*</span></label>
                    <input
                        type="text"
                        className={inputClass(errors.author)}
                        value={formData.author}
                        onChange={(e) => handleChange('author', e.target.value)}
                        onBlur={() => handleBlur('author')}
                        placeholder="Enter author name"
                    />
                    {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Author Email <span className="text-destructive">*</span></label>
                    <input
                        type="email"
                        className={inputClass(errors.authorEmail)}
                        value={formData.authorEmail}
                        onChange={(e) => handleChange('authorEmail', e.target.value)}
                        onBlur={() => handleBlur('authorEmail')}
                        placeholder="author@example.com"
                    />
                    {errors.authorEmail && <p className="text-xs text-destructive">{errors.authorEmail}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Publisher <span className="text-destructive">*</span></label>
                    <input
                        type="text"
                        className={inputClass(errors.publisher)}
                        value={formData.publisher}
                        onChange={(e) => handleChange('publisher', e.target.value)}
                        onBlur={() => handleBlur('publisher')}
                        placeholder="Publisher Name"
                    />
                    {errors.publisher && <p className="text-xs text-destructive">{errors.publisher}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Published Date <span className="text-destructive">*</span></label>
                    <input
                        type="date"
                        className={inputClass(errors.publishedDate)}
                        value={formData.publishedDate}
                        onChange={(e) => handleChange('publishedDate', e.target.value)}
                        onBlur={() => handleBlur('publishedDate')}
                    />
                    {errors.publishedDate && <p className="text-xs text-destructive">{errors.publishedDate}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Page Count <span className="text-destructive">*</span></label>
                    <input
                        type="number"
                        className={inputClass(errors.pageCount)}
                        value={formData.pageCount || ''}
                        onChange={(e) => handleChange('pageCount', Number(e.target.value))}
                        onBlur={() => handleBlur('pageCount')}
                        placeholder="e.g. 300"
                    />
                    {errors.pageCount && <p className="text-xs text-destructive">{errors.pageCount}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Overview <span className="text-destructive">*</span></label>
                <textarea
                    className={`${inputClass(errors.overview)} resize-none  min-h-[100px]`}
                    value={formData.overview}
                    maxLength={500}
                    onChange={(e) => handleChange('overview', e.target.value)}
                    onBlur={() => handleBlur('overview')}
                    placeholder="Book summary..."
                />
                {errors.overview && <p className="text-xs text-destructive">{errors.overview}</p>}
                <p className='text-xs text-right w-full font-bold'>{formData.overview.length}/500</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting || isLoading}
                    className=" items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-4 py-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    {isSubmitting || isLoading ? 'Saving...' : initialData ? 'Update Book' : 'Add Book'}
                </button>
            </div>
        </form>
    );
}
