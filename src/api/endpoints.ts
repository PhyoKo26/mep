import { create } from 'axios';

export const API_ENDPOINTS = {
  create_user: '/auth/register',
  login: '/auth/login',
  get_user: '/auth/me',
  get_home: '/home',
  get_home_promotions: '/home/promotions',
  get_all_authors: '/authors',
  get_all_book_groups: '/book-lists/all-with-books',
  get_books_by_group_id: '/book-lists/detail',
  get_books_by_author_id: '/authors/books',
  get_books_by_search: '/books',
  get_book_detail: '/books/detail',
  get_all_book_related: '/books/related',
  get_my_collections: '/collections',
  buy_book: '/payments/buy'
};
