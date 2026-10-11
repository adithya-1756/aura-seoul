export interface Color {
  name: string;
  hex: string;
  code: string;
}

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  categoryId: string;
  category?: Category;
  style: string;
  gender: 'Women' | 'Men' | 'Unisex';
  fabric: string;
  fit: string;
  careInstructions?: string;
  ratingsAverage: number;
  ratingsCount: number;
  images: string[];
  colors: Color[];
  sizes: string[];
  variants: ProductVariant[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder?: number;
  productCount?: number;
}

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  availableStock?: number;
  itemTotal?: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    fabric?: string;
  };
}

export interface CartTotals {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  finalTotal: number;
  appliedCoupon?: string | null;
  freeShippingThreshold: number;
  freeShippingDifference: number;
  isEligibleForFreeShipping: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  orderCount?: number;
  addressCount?: number;
  createdAt?: string;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  houseDetails: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
  deliveryInstructions?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug?: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestEmail?: string | null;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string | null;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  razorpayPaymentId?: string | null;
  status: string;
  shippingAddress: Address;
  trackingNumber: string;
  trackingCarrier: string;
  estimatedDeliveryDate: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number | null;
  expiryDate?: string;
  isActive: boolean;
  firstOrderOnly?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ReviewStats {
  reviews: Review[];
  total: number;
  average: number;
  distribution: { [key: number]: number };
}

export interface Announcement {
  id: string;
  text: string;
}

export interface HeroBanner {
  id: string;
  headline: string;
  subheadline: string;
  buttonPrimaryText: string;
  buttonPrimaryLink: string;
  buttonSecondaryText: string;
  buttonSecondaryLink: string;
  bgImage: string;
  badge?: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  image: string;
  tag?: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  supportEmail: string;
  supportPhone: string;
  officeAddress: string;
}

export interface HomepageContent {
  announcements: Announcement[];
  heroBanners: HeroBanner[];
  promotionalBanners: PromoBanner[];
  siteSettings: SiteSettings;
}
