export interface Chapter {
  id: string;
  title: string;
  class: '11' | '12';
  status: 'active' | 'coming_soon' | 'locked';
  category: 'mechanics' | 'electromagnetism' | 'optics' | 'modern' | 'thermodynamics';
  description?: string;
  progress?: number;
}