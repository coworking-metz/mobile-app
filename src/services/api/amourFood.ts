import { HTTP } from '../http';

export interface AmourFoodMenu {
  id: number;
  date: string;
  label: string;
  description: string;
  url: string;
  picture: string;
}

export const getMenu = (): Promise<AmourFoodMenu> => {
  return HTTP.get('/amour-food/menu').then(({ data }) => data);
};
