export type NoteCategory = "推荐" | "穿搭" | "美食" | "旅行" | "家居" | "数码" | "摄影";

export interface NoteAuthor {
  name: string;
  initial: string;
  avatarBg: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: Exclude<NoteCategory, "推荐">;
  imageUrl: string;
  aspectRatio: number; // height / width
  author: NoteAuthor;
  likes: number;
  liked: boolean;
  tags: string[];
  createdAt: string;
}
