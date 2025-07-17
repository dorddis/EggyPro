import type { Product, Review, ApiProduct, CreateProductData, UpdateProductData } from './types';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function fetchProduct(slug: string): Promise<ApiProduct> {
  const response = await fetch(`/api/products/${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
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