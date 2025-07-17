# Admin UI Specification for Live Product Implementation

## 1. Introduction

This document specifies the comprehensive admin interface for managing products in the EggyPro application. The admin UI provides a secure, intuitive interface for administrators to create, read, update, and delete products, manage inventory levels, upload images via Cloudinary, and monitor product performance. The interface leverages existing UI components and follows the established design patterns of the application.

## 2. Technology Stack & Architecture

### 2.1 Frontend Technology
- **Framework**: Next.js 15.2.3 with App Router
- **UI Library**: Shadcn/ui components (existing in `src/components/ui/`)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **Form Handling**: React Hook Form with Zod validation
- **Image Upload**: Cloudinary integration
- **Authentication**: Bearer token-based admin authentication

### 2.2 Project Structure
```
src/app/admin/
├── layout.tsx              # Admin layout with navigation
├── page.tsx                # Admin dashboard
├── products/
│   ├── page.tsx            # Product management page
│   ├── [slug]/
│   │   └── page.tsx        # Edit product page
│   └── new/
│       └── page.tsx        # Create product page
└── components/
    ├── ProductDataTable.tsx # Product listing with inventory
    ├── ProductForm.tsx      # Create/edit product form
    ├── ImageUpload.tsx      # Cloudinary image upload
    ├── InventoryManager.tsx # Stock quantity management
    └── AdminHeader.tsx      # Admin navigation header
```

## 3. Authentication & Security

### 3.1 Admin Authentication

**File**: `src/lib/admin-auth.ts`

```typescript
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export interface AdminUser {
  id: string;
  role: 'admin';
  permissions: string[];
}

export function verifyAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.ADMIN_SECRET_KEY;
  
  if (!authHeader || !expectedToken) {
    return false;
  }
  
  const token = authHeader.replace('Bearer ', '');
  return token === expectedToken;
}

export function requireAdminAuth(): AdminUser {
  // This will be called in server components
  // Implementation depends on your auth strategy
  return {
    id: 'admin',
    role: 'admin',
    permissions: ['products:read', 'products:write', 'products:delete'],
  };
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  // Client-side auth guard component
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/admin/verify', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
```

### 3.2 Admin Layout

**File**: `src/app/admin/layout.tsx`

```typescript
import { AdminHeader } from '@/app/admin/components/AdminHeader';
import { AdminGuard } from '@/lib/admin-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
```

## 4. Core Admin Components

### 4.1 Product Data Table

**File**: `src/app/admin/components/ProductDataTable.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock_quantity: number;
  images: string[];
  created_at: string;
}

export function ProductDataTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= 10) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge variant="default">In Stock</Badge>;
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Products</CardTitle>
          <Button onClick={() => router.push('/admin/products/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>{getStockStatus(product.stock_quantity)}</TableCell>
                <TableCell>
                  {new Date(product.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/product/${product.slug}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/products/${product.slug}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.slug)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

### 4.2 Product Form

**File**: `src/app/admin/components/ProductForm.tsx`

```typescript
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';
import { InventoryManager } from './InventoryManager';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  details: z.string().min(1, 'Details are required'),
  price: z.number().positive('Price must be positive').max(999999.99, 'Price too high'),
  stock_quantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: ProductFormData;
  mode: 'create' | 'edit';
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: '',
      slug: '',
      description: '',
      details: '',
      price: 0,
      stock_quantity: 0,
      ingredients: [''],
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'ingredients') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      // Add images
      images.forEach((image) => {
        formData.append('images', image);
      });

      const url = mode === 'create' ? '/api/products' : `/api/products/${product?.slug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const error = await response.json();
        console.error('Failed to save product:', error);
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create Product' : 'Edit Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="EggyPro Original" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="eggypro-original" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief product description..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Detailed product information..."
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <InventoryManager
              value={form.watch('stock_quantity')}
              onChange={(value) => form.setValue('stock_quantity', value)}
            />

            <ImageUpload
              images={images}
              onImagesChange={setImages}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/products')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

### 4.3 Inventory Manager

**File**: `src/app/admin/components/InventoryManager.tsx`

```typescript
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

interface InventoryManagerProps {
  value: number;
  onChange: (value: number) => void;
}

export function InventoryManager({ value, onChange }: InventoryManagerProps) {
  const [adjustment, setAdjustment] = useState<number>(0);

  const handleAdjustment = (amount: number) => {
    const newValue = Math.max(0, value + amount);
    onChange(newValue);
  };

  const getStockStatus = () => {
    if (value === 0) {
      return {
        status: 'out-of-stock',
        icon: <AlertTriangle className="w-4 h-4" />,
        badge: <Badge variant="destructive">Out of Stock</Badge>,
        message: 'This product is currently out of stock and will not be purchasable.',
      };
    } else if (value <= 10) {
      return {
        status: 'low-stock',
        icon: <AlertTriangle className="w-4 h-4" />,
        badge: <Badge variant="secondary">Low Stock</Badge>,
        message: 'Stock is running low. Consider restocking soon.',
      };
    } else {
      return {
        status: 'in-stock',
        icon: <CheckCircle className="w-4 h-4" />,
        badge: <Badge variant="default">In Stock</Badge>,
        message: 'Product is available for purchase.',
      };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="w-5 h-5" />
          <span>Inventory Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {stockStatus.icon}
            <span className="font-medium">Current Stock:</span>
            <span className="text-2xl font-bold">{value}</span>
            {stockStatus.badge}
          </div>
        </div>

        <Alert variant={stockStatus.status === 'out-of-stock' ? 'destructive' : 'default'}>
          <AlertDescription>{stockStatus.message}</AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Adjustments</label>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAdjustment(-1)}
              >
                -1
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAdjustment(-5)}
              >
                -5
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAdjustment(-10)}
              >
                -10
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Add Stock</label>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAdjustment(1)}
              >
                +1
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAdjustment(5)}
              >
                +5
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAdjustment(10)}
              >
                +10
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Set Exact Quantity</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                min="0"
                value={adjustment}
                onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                className="w-20"
              />
              <Button
                size="sm"
                onClick={() => {
                  onChange(adjustment);
                  setAdjustment(0);
                }}
              >
                Set
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4.4 Image Upload Component

**File**: `src/app/admin/components/ImageUpload.tsx`

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onImagesChange([...images, ...data.urls]);
      }
    } catch (error) {
      console.error('Failed to upload images:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5" />
          <span>Product Images</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop images here, or click to select
          </p>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Select Images'}
          </Button>
        </div>

        {images.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploaded Images ({images.length})</span>
              <Badge variant="secondary">Drag to reorder</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group cursor-move"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    reorderImages(fromIndex, index);
                  }}
                >
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  {index === 0 && (
                    <Badge className="absolute bottom-1 left-1" variant="default">
                      Primary
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

## 5. Admin Pages

### 5.1 Admin Dashboard

**File**: `src/app/admin/page.tsx`

```typescript
import { ProductDataTable } from './components/ProductDataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your products and inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      <ProductDataTable />
    </div>
  );
}
```

### 5.2 Product Management Page

**File**: `src/app/admin/products/page.tsx`

```typescript
import { ProductDataTable } from '../components/ProductDataTable';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Management</h1>
        <p className="text-gray-600">Manage your product catalog and inventory</p>
      </div>
      
      <ProductDataTable />
    </div>
  );
}
```

### 5.3 Create Product Page

**File**: `src/app/admin/products/new/page.tsx`

```typescript
import { ProductForm } from '../../components/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <p className="text-gray-600">Add a new product to your catalog</p>
      </div>
      
      <ProductForm mode="create" />
    </div>
  );
}
```

### 5.4 Edit Product Page

**File**: `src/app/admin/products/[slug]/page.tsx`

```typescript
import { ProductForm } from '../../components/ProductForm';

interface EditProductPageProps {
  params: { slug: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // Fetch product data
  const product = await fetch(`/api/products/${params.slug}`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_SECRET_KEY}`,
    },
  }).then(res => res.json());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-gray-600">Update product information and inventory</p>
      </div>
      
      <ProductForm mode="edit" product={product.data} />
    </div>
  );
}
```

## 6. API Integration

### 6.1 Admin API Hooks

**File**: `src/hooks/use-admin-api.ts`

```typescript
import { useState } from 'react';

interface UseAdminApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useAdminApi(options: UseAdminApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async (url: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      options.onSuccess?.(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Request failed';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    makeRequest,
  };
}
```

## 7. Security & Validation

### 7.1 Form Validation

All forms use Zod schemas for validation:

```typescript
// Product validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  details: z.string().min(1, 'Details are required'),
  price: z.number().positive('Price must be positive').max(999999.99, 'Price too high'),
  stock_quantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
});
```

### 7.2 Authentication Guards

All admin pages are protected by authentication guards:

```typescript
// Server-side protection
export default async function AdminPage() {
  const user = requireAdminAuth();
  // ... page content
}

// Client-side protection
<AdminGuard>
  <AdminPageContent />
</AdminGuard>
```

## 8. Error Handling & User Feedback

### 8.1 Toast Notifications

```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success notification
toast({
  title: 'Product created successfully',
  description: 'The product has been added to your catalog.',
});

// Error notification
toast({
  title: 'Failed to create product',
  description: 'Please check your input and try again.',
  variant: 'destructive',
});
```

### 8.2 Loading States

All async operations show loading states:

```typescript
const [loading, setLoading] = useState(false);

<Button disabled={loading}>
  {loading ? 'Saving...' : 'Save Product'}
</Button>
```

## 9. Responsive Design

The admin interface is fully responsive:

- **Desktop**: Full-featured interface with side-by-side forms
- **Tablet**: Stacked layout with optimized touch targets
- **Mobile**: Single-column layout with collapsible sections

## 10. Testing Strategy

### 10.1 Component Testing

```typescript
// ProductForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductForm } from './ProductForm';

describe('ProductForm', () => {
  it('should validate required fields', () => {
    render(<ProductForm mode="create" />);
    
    const submitButton = screen.getByText('Create Product');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });
});
```

### 10.2 Integration Testing

```typescript
// Admin workflow test
describe('Admin Workflow', () => {
  it('should create, edit, and delete products', async () => {
    // Test complete admin workflow
  });
});
```

This comprehensive admin UI specification provides all the necessary components, pages, and functionality for managing products and inventory in the EggyPro application, following the established patterns and requirements from the master specification. 