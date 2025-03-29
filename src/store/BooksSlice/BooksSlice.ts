import { createSlice } from "@reduxjs/toolkit";
import { type_book_slice } from "@/types/BookTypes";

const initialState: type_book_slice = {
 userBooks: [],
 publishedBooks: [],
 reviewBooks: [],
 draftBooks: [],
 isUserBooksFetched: false,
 book: {}
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    fetchUserBooks: (state, action) => {
      state.userBooks = action.payload;
      state.isUserBooksFetched = true;
      const { publishedBooks, reviewBooks, draftBooks } = action.payload.reduce(
        (acc, book) => {
          if (book.status === "PUBLISHED") acc.publishedBooks.push(book);
          else if (book.status === "REVIEW") acc.reviewBooks.push(book);
          else if (book.status === "DRAFT") acc.draftBooks.push(book);
          return acc;
        },
        { publishedBooks: [], reviewBooks: [], draftBooks: [] }
      );
      state.publishedBooks = publishedBooks;
      state.reviewBooks = reviewBooks;
      state.draftBooks = draftBooks;
    },
    fetchBook: (state, action) => {
      state.book = action.payload;
    }
  },
});

export const bookSliceReducer = bookSlice.reducer;
export const bookSliceActions = bookSlice.actions;
 