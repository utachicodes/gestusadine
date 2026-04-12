
export type ContentType = 'video' | 'podcast_episode';
export type AudienceLevel = 'kids' | 'teens' | 'adults';
export type EventStatus = 'confirmed' | 'waitlist' | 'cancelled';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';
export type PaymentMethod = 'orange_money' | 'wave' | 'card' | 'cash';
export type BookFormat = 'pdf' | 'epub' | 'mobi' | 'audio';
export type BookCategory = 'quran' | 'hadith' | 'fiqh' | 'aqeedah' | 'seerah' | 'tafsir' | 'arabic' | 'dua' | 'general';
export type BookLanguage = 'ar' | 'en' | 'fr';

export interface UserActivity {
    id: string;
    user_id: string;
    activity_type: 'video_watch' | 'event_register' | 'purchase';
    target_id: string;
    metadata?: Record<string, any>;
    created_at: string;
}

export interface MediaContent {
    id: string;
    title: string;
    description: string;
    type: ContentType;
    url: string;
    thumbnail_url?: string;
    duration_seconds?: number;
    language: string;
    audience: AudienceLevel;
    transcript?: string;
    published_at: string;
    created_at: string;
}

export interface MediaProgress {
    user_id: string;
    media_id: string;
    progress_seconds: number;
    completed: boolean;
    last_watched_at: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time?: string;
    location_name: string;
    location_coordinates?: { x: number; y: number }; // Point
    is_online: boolean;
    max_attendees?: number;
    image_url?: string;
    created_at: string;
}

export interface EventRegistration {
    id: string;
    event_id: string;
    user_id: string;
    status: EventStatus;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    stock_quantity: number;
    images: string[];
    category: string;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: OrderStatus;
    payment_method: PaymentMethod;
    created_at: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
}

export interface DigitalBook {
    id: string;
    title: string;
    author: string;
    description: string;
    category: BookCategory;
    language: BookLanguage;
    format: BookFormat;
    file_url: string;
    cover_image_url?: string;
    page_count?: number;
    file_size_mb?: number;
    isbn?: string;
    publisher?: string;
    publication_year?: number;
    downloads: number;
    featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface BookDownload {
    id: string;
    user_id: string;
    book_id: string;
    downloaded_at: string;
}
