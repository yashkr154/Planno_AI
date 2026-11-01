export type EventType = 
  | 'wedding' 
  | 'hackathon' 
  | 'birthday' 
  | 'conference' 
  | 'party' 
  | 'corporate' 
  | 'other';

export type EventStatus = 'draft' | 'planning' | 'confirmed' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  description: string;
  date: string;
  time?: string;
  location: string;
  city: string;
  guestCount: number;
  budget: number;
  estimatedCost: number;
  actualCost: number;
  disbursedAmount: number;
  outstandingAmount: number;
  status: EventStatus;
  theme?: string;
  venueId?: string;
  createdAt: string;
  currency?: string;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
}

export interface Expense {
  id: string;
  eventId: string;
  category: string;
  description: string;
  estimatedAmount: number;
  actualAmount: number;
  paidAmount: number;
  status: 'planned' | 'pending' | 'paid';
  vendor?: string;
  date?: string;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  rsvpStatus: 'attending' | 'declined' | 'pending';
  plusOne: boolean;
  tableNumber?: string;
  qrToken: string;
  dietPreferences?: string;
  invitationSent: boolean;
  group?: string;
  category?: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  capacity: number;
  priceRange: string;
  pricePerDay: number;
  rating: number;
  images: string[];
  amenities: string[];
  contact: {
    phone: string;
    email: string;
  };
  googleMapsUrl: string;
  description: string;
  recommendedFor: EventType[];
  matchScore?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Catering' | 'Decoration' | 'Photography' | 'Sound & AV' | 'Entertainment' | 'Logistics' | 'Other';
  rating: number;
  phone: string;
  email: string;
  city: string;
  priceRange: string;
  services: string[];
  verified: boolean;
  image: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  style: 'google_vibrant' | 'royal_gold' | 'minimalist' | 'cyber_neon';
  previewBg: string;
  textColor: string;
  accentColor: string;
}

export interface AIEventBlueprint {
  title: string;
  type: EventType;
  theme: string;
  suggestedBudget: number;
  estimatedGuests: number;
  schedule: {
    time: string;
    activity: string;
    description: string;
  }[];
  menu: {
    category: string;
    items: string[];
  }[];
  decorConcept: {
    palette: string[];
    description: string;
    keyElements: string[];
  };
  recommendedTasks: {
    title: string;
    category: string;
    daysBeforeEvent: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  estimatedExpenses: {
    category: string;
    description: string;
    estimatedAmount: number;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  preferredCurrency: string;
}
