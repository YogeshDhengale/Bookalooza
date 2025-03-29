import React from "react";
import LibraryBookCard from "./LibraryBookCard";
import { Book } from "@/types/BookTypes";

const LibraryBookListing = ({ books }: { books: Book[] }) => {
  return (
    <div className="w-1/3 h-full overflow-auto">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-2">
        {books.map((book) => {
          return <LibraryBookCard book={book} key={book.id} />;
        })}
      </div>
    </div>
  );
};

export default LibraryBookListing;
