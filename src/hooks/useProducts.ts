import { db } from '@/lib/instantdb';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  is_available: boolean;
  stock: number;
  created_at: Date;
  updated_at: Date;
}

export function useProducts() {
  // Query products from InstantDB
  const { data, isLoading, error } = db.useQuery({ 
    products: {
      $: {
        where: {
          is_available: true
        }
      }
    }
  });

  const products = data?.products || [];

  // Helper function to get product by ID
  const getProduct = (id: string): Product | undefined => {
    const product = products.find(p => p.id === id);
    if (!product) return undefined;
    
    return {
      ...product,
      created_at: new Date(product.created_at),
      updated_at: new Date(product.updated_at)
    };
  };

  // Helper function to check stock
  const checkStock = (id: string, quantity: number): boolean => {
    const product = getProduct(id);
    return product ? product.stock >= quantity : false;
  };

  return {
    products,
    isLoading,
    error,
    getProduct,
    checkStock,
  };
}