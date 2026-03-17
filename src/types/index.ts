import { Chapter as ConfigChapter } from '../config/chapters';

export type Chapter = ConfigChapter;

export interface Message {
  role: 'user' | 'model';
  text: string;
}