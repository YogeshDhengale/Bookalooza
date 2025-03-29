import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Book } from "@/types/BookTypes";
import { Badge } from "../../ui/badge";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

const LibraryBookCard = ({ book }: { book: Book }) => {
  return (
    <Link
      to={
        book.status === "PUBLISHED"
          ? `/details/${book.urlSlag}`
          : book.status === "DRAFT"
          ? `/edit/${book.urlSlag}`
          : "#"
      }
      className={cn(
        book.status === "REVIEW" && "cursor-default pointer-events-none"
      )}
    >
      <Card>
        <div className="relative bg-purple-100 px-2 py-3 flex items-center rounded-t-xl justify-center">
          <img
            className="bg-white object-contain rounded shadow-xl shadow-purple-500/404 max-w-none"
            src={book.frontThumbURL}
            alt={book.id}
            width={96}
            height={144}
            loading="lazy"
          />
          <div className="w-fit h-fit absolute top-2 right-2">
            <Badge
              variant={
                book.status === "DRAFT"
                  ? "destructive"
                  : book.status === "PUBLISHED"
                  ? "published"
                  : "review"
              }
              className="capitalize"
            >
              {book.status}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h5>{book.title || "Untitled"}</h5>
          <Badge variant="secondary" className="capitalize">
            By {book.author}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LibraryBookCard;
