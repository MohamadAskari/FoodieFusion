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
}

export type FilterOption = {
  category: string;
  value: string;
  selected: boolean;
};
