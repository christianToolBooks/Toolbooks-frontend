import { CategoryItem } from '@/src/types/category';
import { ResponseApiInterface } from '@/src/types/apiResponse';
import apiClient from '../axios';

interface FetchCategoriesResponse extends ResponseApiInterface {
  categories: CategoryItem[];
}

/**
 * GET / Get all categories to filter Transactions
 * @returns CategoryItem
 */
export const fetchCategoriesService =
  async (): Promise<FetchCategoriesResponse> => {
    try {
      const res = await apiClient.get<CategoryItem[]>(
        'bank-statement/transactions/categories'
      );
      if (res.data.length === 0) {
        return {
          success: true,
          message: "There's not Categories",
          categories: res.data,
        };
      }

      return {
        success: true,
        message: 'Categories successfully obtained',
        categories: res.data,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Cannot possible get Categories',
        categories: [],
      };
    }
  };
