import { Book } from "./Book";

export interface UserBook {
  id: number;
  bookId: number;
  totalPages: number;
  pagesRead: number;
  progress: number;
  book: Book;
}