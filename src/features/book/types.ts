import { Author } from "features/author/types";

export type BookListsStackParamList = {
  BookListsScreen: { title: string, searchKey?: string };
  BookDetailScreen: { id: number | string };
  BookBuyScreen: { bookDetail: string };
  BookReadScreen: { title: string, bookURL: string };
  BookPlaylistScreen: { bookDetail: {} | string };
  BookPlayScreen: { bookDetail: {} | string };
};

export type Book = {
  id: number;
  cover_image: string;  // cover_image from API
  title: string;
  author_name: string;  // Full author object
  price: number;   // 8000 (number)
  description: string;
  pdf_url: string; // Renamed from audioUrl
  audios: string;
  pages: number;
  language: string;
  download_count: number;
  view_count: number;
  rating: number;
  published_year: string | null;
  created_at: string;
  category: string;
  author: Author;
  book_status: number;
  sample_url: string;
  pwd: string;
};
