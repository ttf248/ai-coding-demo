export type CategoryId = 'recommend' | 'travel' | 'food' | 'home' | 'pets' | 'city';
export type NoteCategory = Exclude<CategoryId, 'recommend'>;

export interface Author {
  id: string;
  name: string;
  color: string;
}

export type Scene = 'mountain' | 'sea' | 'coffee' | 'dessert' | 'plant' | 'flowers' | 'cat' | 'city';

export interface ImageMeta {
  file: string;
  width: number;
  height: number;
  category: NoteCategory;
  scene: Scene;
}

export interface Note {
  id: string;
  title: string;
  desc: string;
  /** Path relative to the site base, e.g. `images/01-mountain-dawn.svg`. */
  image: string;
  width: number;
  height: number;
  author: Author;
  likes: number;
  collects: number;
  comments: number;
  category: NoteCategory;
  tags: string[];
  createdAt: number;
  published?: boolean;
}

export interface PageResult {
  items: Note[];
  hasMore: boolean;
  total: number;
}
