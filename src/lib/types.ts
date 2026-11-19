export interface DigitalProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  format: string;
  pageCount: number;
  fileSize: string;
  language: string;
  delivery: string;
  access: string;
  refunds: string;
  category: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar?: string;
  coverUrl: string;
  jacketStyle: "swiss" | "classic" | "minimal" | "modern";
  jacketColor: string;
  samplePages: string[];
  digitalFileUrl: string;
  samplePdfUrl?: string;
  salesCount: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  amount: number;
  customerEmail: string;
  customerPhone: string;
  customerName?: string;
  couponCode?: string | null;
  discountAmount: number;
  paymentId: string;
  paymentMethod: string;
  paymentStatus: "completed" | "pending" | "refunded";
  downloadToken: string;
  downloadCount: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minAmount: number;
  active: boolean;
  usesCount: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  count: number;
}

export interface Creator {
  id: string;
  handle: string;
  name: string;
  bio: string;
  avatar: string;
  titlesCount: number;
  verified: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  established: string;
  currency: string;
  currencySymbol: string;
  adminPin: string;
  supportEmail: string;
  razorpayKeyId: string;
}
