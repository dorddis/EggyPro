'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Star, ShoppingCart, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductStats {
  totalProducts: number;
  totalStock: number;
  totalReviews: number;
  averageRating: string;
  lowStockProducts: Product[];
  summary: {
    inStock: number;
    outOfStock: number;
    lowStock: number;
  };
}

export function AdminDashboard() {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, productsResponse] = await Promise.all([
        fetch('/api/products/stats'),
        fetch('/api/products')
      ]);
      
      const statsData = await statsResponse.json();
      const productsData = await productsResponse.json();
      
      setStats(statsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Failed to load admin dashboard data
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <Button onClick={fetchData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Units available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Customer reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>In Stock</span>
                <Badge variant="default">{stats.summary.inStock}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Low Stock (&lt; 50)</span>
                <Badge variant="secondary">{stats.summary.lowStock}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Out of Stock</span>
                <Badge variant="destructive">{stats.summary.outOfStock}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">${product.price}</p>
                  </div>
                  <Badge 
                    variant={product.stock_quantity === 0 ? "destructive" : 
                            product.stock_quantity < 50 ? "secondary" : "default"}
                  >
                    {product.stock_quantity} units
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold">${product.price}</p>
                  <Badge variant={product.stock_quantity > 50 ? "default" : 
                                product.stock_quantity > 0 ? "secondary" : "destructive"}>
                    {product.stock_quantity} in stock
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}