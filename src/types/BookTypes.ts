export interface type_book_slice {
    userBooks: Book[] | [];
    publishedBooks: Book[] | [];
    reviewBooks: Book[] | [];
    draftBooks: Book[] | [];
    isUserBooksFetched: boolean;
    book: {};
}

export interface Remark {
    text: string;
    time: number;
    userId: string;
}

export interface Book {
    id: string;
    status: "PUBLISHED" | "DRAFT" | "REVIEW"; // Add other statuses as needed
    category: string | null;
    theme: string;
    title: string;
    summary: string | null;
    language: string;
    totalPages: number;
    isbn: string | null;
    bookscapeUrl: string | null;
    printingType: "Paperback" | "Hardcover" | "Ebook"; // Extend if other types exist
    author: string;
    authorId: string;
    aboutAuthor: string;
    description: string;
    seoDescription: string | null;
    lastEditedBy: string;
    approvedBy: string;
    wallOfFame: string | null;
    customStoreSection: string[]; // Adjust if it holds objects
    overallRating: number;
    publishDate: number; // Unix timestamp in milliseconds
    reviewDate: number;  // Unix timestamp in milliseconds
    updateDate: number;  // Unix timestamp in milliseconds
    designPath: string;
    frontThumbURL: string;
    backThumbURL: string;
    urlSlag: string;
    views: number;
    likes: number;
    orders: number;
    remarks: Remark[];
    trackingId: string;
    isProofReading: boolean;
    isListing: boolean;
    isEditorChoice: boolean;
    schoolPrice: number;
    regularPrice: number;
}
