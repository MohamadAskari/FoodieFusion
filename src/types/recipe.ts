export interface Recipe {
  id: string;
  image: any;
  title: string;
  creator: string;
  likes: string;
  rating: string;
  cookingTime: number; // in minutes
  mealTime: string[];
  diets: string[];
  ingredients: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  user: string;
  date: string;
  text: string;
  likes: string;
}

export type FilterOption = {
  category: string;
  value: string;
  selected: boolean;
};
