import type { Product, ApiProduct, CreateProductData, UpdateProductData } from './types';

export async function fetchProducts(): Promise<Product[]> {
  // For client-side, always use relative URLs
  if (typeof window !== 'undefined') {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle both old format (direct array) and new format (with data property)
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      throw new Error('Invalid response format from products API');
    }
  }
  
  // For server-side during build, use fallback data directly
  const { mockProducts } = await import('@/lib/fallback-data');
  return mockProducts;
}

export async function fetchProduct(slug: string): Promise<ApiProduct> {
  // For client-side, always use relative URLs
  if (typeof window !== 'undefined') {
    const response = await fetch(`/api/products/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle both old format (direct product) and new format (with data property)
    if (data.data) {
      return {
        data: data.data,
        meta: data.meta
      };
    } else {
      // Legacy format - wrap in new format
      return {
        data: data,
        meta: {}
      };
    }
  }
  
  // For server-side during build, use fallback data directly
  const { findProductBySlug, getProductReviews } = await import('@/lib/fallback-data');
  const product = findProductBySlug(slug);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  const reviews = getProductReviews(product.id);
  
  return {
    data: {
      ...product,
      reviews
    },
    meta: {
      fallback: true
    }
  };
}

export async function createProduct(data: CreateProductData, token: string): Promise<Product> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'ingredients') {
      formData.append(key, JSON.stringify(value));
    } else if (key === 'images' && Array.isArray(value)) {
      value.forEach(file => formData.append('images', file));
    } else {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
}

export async function updateProduct(slug: string, data: UpdateProductData, token: string): Promise<Product> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'ingredients') {
      formData.append(key, JSON.stringify(value));
    } else if (key === 'images' && Array.isArray(value)) {
      value.forEach(file => formData.append('images', file));
    } else if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/products/${slug}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return response.json();
}

export async function deleteProduct(slug: string, token: string): Promise<void> {
  const response = await fetch(`/api/products/${slug}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}