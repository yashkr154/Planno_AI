import { Event, Task, Expense, Guest, Venue, Vendor, InvitationTemplate } from '../types';

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-1',
    title: 'Ranchi Celebration & Banquet Wedding',
    type: 'wedding',
    description: 'A beautiful wedding celebration in Ranchi with authentic North Indian catering, floral stage decor, and guest hospitality.',
    date: '2026-12-05',
    time: '04:00 PM',
    location: 'Radisson Blu Hotel, Main Road',
    city: 'Ranchi',
    guestCount: 200,
    budget: 1200000,
    estimatedCost: 1100000,
    actualCost: 950000,
    disbursedAmount: 800000,
    outstandingAmount: 150000,
    status: 'planning',
    theme: 'Traditional Ranchi Heritage Elegance',
    venueId: 'v-ranchi-1',
    createdAt: '2026-02-01',
    currency: 'INR',
  },
  {
    id: 'evt-2',
    title: 'GDG DevFest Gujarat 2026',
    type: 'hackathon',
    description: 'The largest annual developer conference and hackathon in Gujarat uniting 800+ builders, GDG organizers, and tech innovators.',
    date: '2026-11-14',
    time: '09:00 AM',
    location: 'Science City Convention Center',
    city: 'Ahmedabad',
    guestCount: 850,
    budget: 1500000,
    estimatedCost: 1380000,
    actualCost: 1120000,
    disbursedAmount: 950000,
    outstandingAmount: 170000,
    status: 'planning',
    theme: 'Google Vibrant & AI Innovation',
    venueId: 'v-2',
    createdAt: '2026-01-10',
    currency: 'INR',
  },
  {
    id: 'evt-3',
    title: 'Royal Heritage Palace Wedding',
    type: 'wedding',
    description: 'A grand royal heritage palace wedding celebration with floral regal mandap and evening banquet.',
    date: '2026-12-18',
    time: '05:00 PM',
    location: 'Laxmi Vilas Palace Lawns',
    city: 'Vadodara',
    guestCount: 350,
    budget: 2500000,
    estimatedCost: 2420000,
    actualCost: 2100000,
    disbursedAmount: 1800000,
    outstandingAmount: 300000,
    status: 'planning',
    theme: 'Royal Heritage Gold',
    venueId: 'v-1',
    createdAt: '2026-02-01',
    currency: 'INR',
  }
];

export const INITIAL_TASKS: Task[] = [
  { id: 't-1', eventId: 'evt-1', title: 'Confirm Banquet Hall booking at Radisson Blu Ranchi', category: 'Venue', dueDate: '2026-11-15', completed: true, priority: 'high', assignedTo: 'Yash Kumar' },
  { id: 't-2', eventId: 'evt-1', title: 'Finalize Litti Chokha & Shahi Paneer Tasting Menu', category: 'Catering', dueDate: '2026-11-20', completed: false, priority: 'high', assignedTo: 'Priya Sharma' },
  { id: 't-3', eventId: 'evt-1', title: 'Send Digital QR Token Invitations to 200 Guests', category: 'Invitations', dueDate: '2026-11-25', completed: false, priority: 'medium', assignedTo: 'Dev Team' },
  { id: 't-4', eventId: 'evt-2', title: 'Confirm Keynote Speaker slot with Google Cloud team', category: 'Speakers', dueDate: '2026-11-01', completed: true, priority: 'high', assignedTo: 'Yash Kumar' },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', eventId: 'evt-1', category: 'Venue Rental', description: 'Radisson Blu Banquet Hall Booking', estimatedAmount: 400000, actualAmount: 400000, paidAmount: 400000, status: 'paid', vendor: 'Radisson Blu Ranchi' },
  { id: 'exp-2', eventId: 'evt-1', category: 'Catering', description: 'Multi-Course Dinner Buffet for 200 Guests', estimatedAmount: 420000, actualAmount: 400000, paidAmount: 250000, status: 'pending', vendor: 'Ranchi Gourmet Caterers' },
  { id: 'exp-3', eventId: 'evt-1', category: 'Decor & Stage', description: 'Floral Arch & Stage Lighting Rig', estimatedAmount: 200000, actualAmount: 180000, paidAmount: 150000, status: 'pending', vendor: 'Royal Decor Ranchi' },
];

export const INITIAL_GUESTS: Guest[] = [
  { id: 'g-1', eventId: 'evt-1', name: 'Rajesh & Sunita Verma', email: 'rajesh.verma@example.com', phone: '+91 94311 22334', rsvpStatus: 'attending', plusOne: true, tableNumber: 'Table 1 - Ranchi', qrToken: 'PLN-RNC-001', dietPreferences: 'Vegetarian', invitationSent: true, group: 'Family' },
  { id: 'g-2', eventId: 'evt-1', name: 'Alok Kumar', email: 'alok.kumar@tech.in', phone: '+91 98351 44556', rsvpStatus: 'attending', plusOne: false, tableNumber: 'Table 2', qrToken: 'PLN-RNC-002', dietPreferences: 'Regular', invitationSent: true, group: 'Friends' },
  { id: 'g-3', eventId: 'evt-1', name: 'Anjali Sharma', email: 'anjali@startup.org', phone: '+91 99341 77889', rsvpStatus: 'pending', plusOne: false, tableNumber: 'Unassigned', qrToken: 'PLN-RNC-003', dietPreferences: 'Vegetarian', invitationSent: true, group: 'VIP' },
];

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'v-ranchi-1',
    name: 'Radisson Blu Hotel Ranchi',
    location: 'Main Road, Kadru Diversion',
    city: 'Ranchi',
    capacity: 600,
    priceRange: '₹2,50,000 - ₹6,00,000 / day',
    pricePerDay: 350000,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Grand Ballroom', '5-Star Hospitality', 'In-house Chef', 'Valet Parking', 'Central Location'],
    contact: { phone: '+91 651 660 2222', email: 'reservations@raddisonranchi.com' },
    googleMapsUrl: 'https://maps.google.com/?q=Radisson+Blu+Hotel+Ranchi',
    description: 'Premier 5-star hotel in central Ranchi featuring opulent banquets, crystal chandeliers, and multi-cuisine catering.',
    recommendedFor: ['wedding', 'corporate', 'party'],
    coordinates: { lat: 23.3512, lng: 85.3262 }
  },
  {
    id: 'v-ranchi-2',
    name: 'Hotel BNR Chanakya & Gardens',
    location: 'Station Road',
    city: 'Ranchi',
    capacity: 800,
    priceRange: '₹2,00,000 - ₹4,50,000 / day',
    pricePerDay: 280000,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Sprawling Heritage Lawns', 'Historical Ambiance', 'Banquet Halls', 'Buffet Counters'],
    contact: { phone: '+91 651 246 1212', email: 'info@bnrchanakya.in' },
    googleMapsUrl: 'https://maps.google.com/?q=Hotel+BNR+Chanakya+Ranchi',
    description: 'Historic heritage property in Ranchi with sprawling green lawns perfect for open-air weddings and cultural galas.',
    recommendedFor: ['wedding', 'party'],
    coordinates: { lat: 23.3601, lng: 85.3342 }
  },
  {
    id: 'v-mumbai-1',
    name: 'The Taj Mahal Palace & Ballrooms',
    location: 'Apollo Bunder, Colaba',
    city: 'Mumbai',
    capacity: 1000,
    priceRange: '₹12,00,000 - ₹35,00,000 / day',
    pricePerDay: 1500000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1545232979-fbf34fc3e0d8?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Sea View', 'Iconic Heritage', 'Michelin Star Chefs', 'Royal Ballrooms'],
    contact: { phone: '+91 22 6665 3366', email: 'taj.mumbai@tajhotels.com' },
    googleMapsUrl: 'https://maps.google.com/?q=The+Taj+Mahal+Palace+Mumbai',
    description: 'India\'s most famous luxury hotel landmark overlooking the Gateway of India in Mumbai.',
    recommendedFor: ['wedding', 'corporate', 'party'],
    coordinates: { lat: 18.9217, lng: 72.8332 }
  },
  {
    id: 'v-jaipur-1',
    name: 'Rambagh Palace & Royal Gardens',
    location: 'Bhawani Singh Road',
    city: 'Jaipur',
    capacity: 1200,
    priceRange: '₹15,00,000 - ₹40,00,000 / day',
    pricePerDay: 1800000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Royal Maharajah Palace', 'Peacock Courtyard', 'Elephant Welcome', 'Authentic Rajasthani Cuisine'],
    contact: { phone: '+91 141 221 1919', email: 'rambagh.jaipur@tajhotels.com' },
    googleMapsUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur',
    description: 'The Jewel of Jaipur. Former residence of the Maharaja of Jaipur offering unmatched royal grandeur.',
    recommendedFor: ['wedding', 'party'],
    coordinates: { lat: 26.8967, lng: 75.8083 }
  },
  {
    id: 'v-delhi-1',
    name: 'The Imperial New Delhi',
    location: 'Janpath, Connaught Place',
    city: 'Delhi',
    capacity: 800,
    priceRange: '₹8,00,000 - ₹20,00,000 / day',
    pricePerDay: 1000000,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Art Deco Elegance', 'Palm Lawns', 'Fine Dining', 'Central Delhi Location'],
    contact: { phone: '+91 11 2334 1234', email: 'luxury@theimperialindia.com' },
    googleMapsUrl: 'https://maps.google.com/?q=The+Imperial+New+Delhi',
    description: 'Award-winning luxury hotel in Connaught Place offering grand Victorian decor and palatial gardens.',
    recommendedFor: ['conference', 'wedding', 'corporate'],
    coordinates: { lat: 28.6251, lng: 77.2188 }
  },
  {
    id: 'v-bengaluru-1',
    name: 'The Leela Palace Bengaluru',
    location: 'HAL Old Airport Road',
    city: 'Bengaluru',
    capacity: 900,
    priceRange: '₹7,00,000 - ₹18,00,000 / day',
    pricePerDay: 850000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Indo-Saracenic Palace', 'Grand Ballrooms', 'Fiber WiFi', 'Tech Summit Rig'],
    contact: { phone: '+91 80 2521 1234', email: 'reservations.bengaluru@theleela.com' },
    googleMapsUrl: 'https://maps.google.com/?q=The+Leela+Palace+Bengaluru',
    description: 'Majestic palace hotel in the Silicon Valley of India, blending royal grandeur with high-tech conference facilities.',
    recommendedFor: ['hackathon', 'conference', 'corporate', 'wedding'],
    coordinates: { lat: 12.9606, lng: 77.6483 }
  },
  {
    id: 'v-1',
    name: 'Laxmi Vilas Palace Lawns & Durbar Hall',
    location: 'J N Marg, Moti Baug',
    city: 'Vadodara',
    capacity: 1200,
    priceRange: '₹8,00,000 - ₹20,00,000 / day',
    pricePerDay: 850000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Palace Architecture', 'Royal Lawns', 'Helipad Access', 'Valet Parking 500+'],
    contact: { phone: '+91 265 241 2000', email: 'events@laxmivilaspalace.in' },
    googleMapsUrl: 'https://maps.google.com/?q=Laxmi+Vilas+Palace+Vadodara',
    description: 'One of the most magnificent royal heritage palaces in India.',
    recommendedFor: ['wedding', 'corporate', 'party'],
    coordinates: { lat: 22.2937, lng: 73.1924 }
  },
  {
    id: 'v-2',
    name: 'Science City Convention Center',
    location: 'Science City Rd, Sola',
    city: 'Ahmedabad',
    capacity: 1500,
    priceRange: '₹3,50,000 - ₹7,00,000 / day',
    pricePerDay: 450000,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['1200-Seat Auditorium', 'Exhibition Halls', 'Fiber WiFi'],
    contact: { phone: '+91 79 2970 8020', email: 'booking@sciencecity.gujarat.gov.in' },
    googleMapsUrl: 'https://maps.google.com/?q=Science+City+Ahmedabad',
    description: 'State-of-the-art tech conference and exhibition center.',
    recommendedFor: ['hackathon', 'conference', 'corporate'],
    coordinates: { lat: 23.0768, lng: 72.5029 }
  },
  {
    id: 'v-hyderabad-1',
    name: 'Taj Falaknuma Palace',
    location: 'Engine Bowli, Falaknuma',
    city: 'Hyderabad',
    capacity: 750,
    priceRange: '₹10,00,000 - ₹30,00,000 / day',
    pricePerDay: 1200000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Nizam Palace Grandeur', 'Horse Carriage Welcome', 'Royal Dining Hall'],
    contact: { phone: '+91 40 6629 8585', email: 'falaknuma.hyderabad@tajhotels.com' },
    googleMapsUrl: 'https://maps.google.com/?q=Taj+Falaknuma+Palace+Hyderabad',
    description: 'Elevated 2,000 feet above Hyderabad, former palace of the Nizam offering royal luxury.',
    recommendedFor: ['wedding', 'party'],
    coordinates: { lat: 17.3312, lng: 78.4673 }
  },
  {
    id: 'v-kolkata-1',
    name: 'JW Marriott Hotel Kolkata',
    location: 'JBS Haldane Avenue',
    city: 'Kolkata',
    capacity: 1000,
    priceRange: '₹6,00,000 - ₹15,00,000 / day',
    pricePerDay: 750000,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1545232979-fbf34fc3e0d8?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Grand Ballroom', 'Pan-Asian & Bengali Dining', 'Infinity Pool Terrace'],
    contact: { phone: '+91 33 6633 0000', email: 'jw.kolkata@marriott.com' },
    googleMapsUrl: 'https://maps.google.com/?q=JW+Marriott+Hotel+Kolkata',
    description: 'Premier luxury hotel in Kolkata with opulent banquets and award-winning culinary team.',
    recommendedFor: ['wedding', 'conference', 'corporate'],
    coordinates: { lat: 22.5451, lng: 88.3941 }
  },
  {
    id: 'v-goa-1',
    name: 'W Goa Beachfront Resort',
    location: 'Vagator Beach',
    city: 'Goa',
    capacity: 500,
    priceRange: '₹8,00,000 - ₹25,00,000 / day',
    pricePerDay: 1000000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Cliffside Sunset View', 'Private Beach Access', 'Rock Pool Stage'],
    contact: { phone: '+91 832 671 8888', email: 'w.goa@whotels.com' },
    googleMapsUrl: 'https://maps.google.com/?q=W+Goa+Resort',
    description: 'Exquisite destination wedding venue overlooking Vagator Beach in North Goa.',
    recommendedFor: ['wedding', 'party'],
    coordinates: { lat: 15.6019, lng: 73.7336 }
  },
  {
    id: 'v-patna-1',
    name: 'Hotel Maurya & Convention Center',
    location: 'Fraser Road, Gandhi Maidan',
    city: 'Patna',
    capacity: 700,
    priceRange: '₹2,00,000 - ₹5,00,000 / day',
    pricePerDay: 300000,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Central Patna Location', 'Bihari Heritage Cuisine', 'Spacious Lawns'],
    contact: { phone: '+91 612 220 3040', email: 'info@maurya.com' },
    googleMapsUrl: 'https://maps.google.com/?q=Hotel+Maurya+Patna',
    description: 'Iconic hospitality venue in central Patna hosting state conventions and grand weddings.',
    recommendedFor: ['wedding', 'conference', 'corporate'],
    coordinates: { lat: 25.6117, lng: 85.1376 }
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  { id: 'vdr-ranchi-1', name: 'Ranchi Royal Gourmet & Caterers', category: 'Catering', rating: 4.8, phone: '+91 94311 88990', email: 'contact@ranchicatering.in', city: 'Ranchi', priceRange: '₹550 - ₹1,200 / plate', services: ['Litti Chokha Feast', 'North Indian Buffet', 'Live Sweets Counter'], verified: true, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80' },
  { id: 'vdr-1', name: 'Heritage Kathiawadi & Gourmet Caterers', category: 'Catering', rating: 4.9, phone: '+91 98251 22334', email: 'contact@heritagecatering.in', city: 'Vadodara', priceRange: '₹650 - ₹1,400 / plate', services: ['Authentic Gujarati Thali', 'Live Chaat Counter'], verified: true, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80' },
  { id: 'vdr-2', name: 'Royal Mandap & Stage Designers', category: 'Decoration', rating: 4.8, phone: '+91 99099 88776', email: 'info@royalmandap.com', city: 'Vadodara', priceRange: '₹1,50,000 - ₹8,00,000', services: ['Floral Mandap', 'Theme Entrance Arch'], verified: true, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80' },
  { id: 'vdr-3', name: 'Candid Lens & Cinematic Films', category: 'Photography', rating: 4.9, phone: '+91 98240 11990', email: 'hello@candidlens.studio', city: 'Ahmedabad', priceRange: '₹80,000 - ₹3,00,000', services: ['4K Drone Coverage', 'Pre-Wedding Shoot'], verified: true, image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80' },
];

export const INVITATION_TEMPLATES: InvitationTemplate[] = [
  { id: 'tpl-1', name: 'Google Vibrant Modern', style: 'google_vibrant', previewBg: 'from-blue-600 via-indigo-600 to-purple-600', textColor: 'text-white', accentColor: 'bg-google-blue' },
  { id: 'tpl-2', name: 'Royal Heritage Gold', style: 'royal_gold', previewBg: 'from-amber-900 via-yellow-900 to-stone-900', textColor: 'text-amber-100', accentColor: 'bg-amber-500' },
  { id: 'tpl-3', name: 'Minimalist Monochrome', style: 'minimalist', previewBg: 'from-slate-900 to-zinc-900', textColor: 'text-slate-100', accentColor: 'bg-slate-700' },
  { id: 'tpl-4', name: 'Cyber Neon Pulse', style: 'cyber_neon', previewBg: 'from-slate-950 via-teal-950 to-blue-950', textColor: 'text-teal-200', accentColor: 'bg-teal-400' },
];
