export type BookListsStackParamList = {
  BookListsScreen: { title: string };
  BookDetailScreen: { id: number | string };
  BookBuyScreen: { bookDetail: string };
  BookReadScreen: { title: string };
  BookPlayScreen: { bookDetail: {} | string };
};

export type Book = {
  id: string;
  image: any;
  title: string;
  author: string;
  price: string;
  description: string;
  audioUrl: string;
};
