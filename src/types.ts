export interface AnimalDay {
  id: number;
  date: number;
  index: string;
  role: string;
  title: string;
  bubble: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  imageUrl: string;
  skills: { name: string; value: number }[];
  widgetTemplate: 'giraffe' | 'polar_bear' | 'penguin' | 'lion' | 'seal' | 'monkey';
}

export interface Specimen {
  id: string;
  category: 'mammals' | 'marine' | 'aviary';
  title: string;
  scientific: string;
  range: string;
  status: string;
  desc: string;
  gradient: string;
  accent: string;
  ambient: [string, string];
  imageUrl: string;
  symbolCode: 'diagonal' | 'grid' | 'half_moon' | 'circle_cross' | 'concentric' | 'waves';
}
