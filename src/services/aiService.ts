import { AIEventBlueprint } from '../types';

export async function generateEventBlueprint(prompt: string): Promise<AIEventBlueprint> {
  try {
    const res = await fetch('/api/generate-blueprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.title && data.schedule) {
        return data as AIEventBlueprint;
      }
    }
  } catch (err) {
    console.warn('Server blueprint API failed, falling back to local heuristic:', err);
  }

  return generateHeuristicBlueprint(prompt);
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  groundingMetadata?: any;
}

export async function sendChatMessage(
  messages: { role: 'user' | 'model'; content: string }[],
  model: 'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' = 'gemini-3.8-flash',
  systemInstruction?: string,
  enableMapsGrounding: boolean = false
): Promise<{ text: string; groundingMetadata?: any }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model,
        systemInstruction,
        enableMapsGrounding,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    const errData = await res.json();
    throw new Error(errData.error || 'Server returned error');
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return {
      text: `Apologies, I encountered an issue connecting to the AI assistant server: ${err.message || 'Error'}. Please try again.`,
    };
  }
}

export async function searchVenuesWithMapsGrounding(
  query: string,
  city: string = 'Ranchi'
): Promise<{ text: string; groundingMetadata?: any }> {
  try {
    const res = await fetch('/api/venue-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, city }),
    });

    if (res.ok) {
      return await res.json();
    }
    throw new Error('Venue search failed');
  } catch (err: any) {
    console.error('Maps Grounding Error:', err);
    return {
      text: `Could not fetch live Google Maps data for "${query}" in ${city}. Please check your internet connection.`,
    };
  }
}

export function detectCityFromPrompt(prompt: string): string {
  const lower = prompt.toLowerCase();
  const indianCities = [
    'ranchi', 'mumbai', 'delhi', 'new delhi', 'jaipur', 'bengaluru', 'bangalore',
    'kolkata', 'chennai', 'hyderabad', 'pune', 'ahmedabad', 'vadodara', 'surat',
    'rajkot', 'patna', 'goa', 'chandigarh', 'lucknow', 'varanasi', 'bhopal',
    'indore', 'kochi', 'dehradun', 'guwahati', 'udaipur', 'jodhpur', 'nagpur', 'agra'
  ];

  for (const city of indianCities) {
    if (lower.includes(city)) {
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }

  // Regex extract after "in "
  const matchIn = prompt.match(/\bin\s+([A-Za-z]+)\b/i);
  if (matchIn && matchIn[1] && matchIn[1].length > 2) {
    const candidate = matchIn[1].toLowerCase();
    if (!['a', 'the', 'my', 'our', 'this', 'that', 'with', 'for'].includes(candidate)) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  return 'Ranchi';
}

function generateHeuristicBlueprint(prompt: string): AIEventBlueprint {
  const lower = prompt.toLowerCase();
  const city = detectCityFromPrompt(prompt);

  let type: any = 'other';
  if (lower.includes('wedding') || lower.includes('sangeet') || lower.includes('shaadi') || lower.includes('marriage')) {
    type = 'wedding';
  } else if (lower.includes('hackathon') || lower.includes('devfest') || lower.includes('code') || lower.includes('build')) {
    type = 'hackathon';
  } else if (lower.includes('birthday') || lower.includes('bday') || lower.includes('anniversary')) {
    type = 'birthday';
  } else if (lower.includes('conference') || lower.includes('summit') || lower.includes('keynote')) {
    type = 'conference';
  } else if (lower.includes('corporate') || lower.includes('product launch')) {
    type = 'corporate';
  } else if (lower.includes('party') || lower.includes('gala') || lower.includes('reception')) {
    type = 'party';
  }

  let budget = 800000;
  if (lower.includes('25')) budget = 2500000;
  else if (lower.includes('15')) budget = 1500000;
  else if (lower.includes('12')) budget = 1200000;
  else if (lower.includes('5')) budget = 500000;

  let guests = 200;
  const matchGuests = lower.match(/(\d+)\s*(guests|people|attendees|delegates)/);
  if (matchGuests && matchGuests[1]) {
    guests = parseInt(matchGuests[1], 10);
  }

  // City-specific regional theme & menu customization
  let theme = `Elegant ${city} Heritage & Celebration`;
  let starters = ['Classic Paneer Tikka', 'Crispy Vegetable Cutlets', 'Kesar Thandai & Mint Coolers'];
  let mains = ['Dal Makhani / Panchmel Dal', 'Paneer Pasanda', 'Jeera Rice & Artisanal Naan', 'Seasonal Regional Special'];
  let desserts = ['Warm Gulab Jamun', 'Rasgulla', 'Kesar Kheer'];

  if (city.toLowerCase() === 'ranchi' || city.toLowerCase() === 'patna') {
    theme = `Traditional ${city} Elegance & Warm Hospitality`;
    starters = ['Crispy Aloo Chop', 'Sattu Drink & Herbal Sharbat', 'Paneer Malai Tikka'];
    mains = ['Authentic Litti Chokha Feast', 'Paneer Shahi Gravy', 'Puri & Chana Masala', 'Mitha Pulao'];
    desserts = ['Hot Malpua with Rabdi', 'Tilkut & Khaja Sweets', 'Gulab Jamun'];
  } else if (city.toLowerCase() === 'jaipur' || city.toLowerCase() === 'udaipur') {
    theme = `Royal Rajasthani Heritage & Pink City Splendor`;
    starters = ['Pyaaz Kachori Bites', 'Kesar Pista Thandai', 'Hariyali Paneer Kebab'];
    mains = ['Dal Baati Churma', 'Gatte Ki Sabzi', 'Ker Sangri Special', 'Shahi Paneer'];
    desserts = ['Ghevar with Rabdi', 'Mawa Kachori', 'Moong Dal Halwa'];
  } else if (city.toLowerCase() === 'mumbai' || city.toLowerCase() === 'pune') {
    theme = `Chic ${city} Modern Glamour & Fusion Elegance`;
    starters = ['Mini Vada Pav Skewers', 'Bombay Bhel Shots', 'Cocktail Mocktails'];
    mains = ['Pav Bhaji Gourmet Bar', 'Paneer Kolhapuri', 'Masala Bhaat', 'Multi-Cuisine Buffet'];
    desserts = ['Shrikhand Puri', 'Chocolate Fondue Bar', 'Modak Delights'];
  }

  const cleanTitlePrompt = prompt.length > 5 ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : `${city} Celebration`;

  return {
    title: cleanTitlePrompt,
    type,
    theme,
    suggestedBudget: budget,
    estimatedGuests: guests,
    schedule: [
      { time: '10:00 AM', activity: `Guest Arrival & ${city} Traditional Welcome`, description: `Warm greeting with refreshing welcome beverages at ${city} venue` },
      { time: '12:00 PM', activity: 'Main Ceremony & Stage Events', description: 'Core celebration rituals and guest interaction' },
      { time: '01:30 PM', activity: `Authentic ${city} Regional Feast`, description: 'Curated multi-course lunch buffet' },
      { time: '05:00 PM', activity: 'Gala Evening High-Tea & Photos', description: 'Photo sessions, toast, and dessert counter' },
    ],
    menu: [
      { category: 'Welcome Drinks & Starters', items: starters },
      { category: 'Main Course Feast', items: mains },
      { category: 'Desserts & Sweets', items: desserts }
    ],
    decorConcept: {
      palette: ['#DAA520', '#4285F4', '#EA4335', '#F8FAFC'],
      description: `Vibrant festive decor blending traditional ${city} cultural arches with elegant ambient LED lighting and fresh flower arrangements.`,
      keyElements: ['Floral Entry Arch', 'Ambient LED Mood Lights', 'Customized Stage Backdrop', 'Seating Lounge']
    },
    recommendedTasks: [
      { title: `Confirm Venue Booking in ${city}`, category: 'Venue', daysBeforeEvent: 30, priority: 'high' },
      { title: `Finalize ${city} Catering Menu & Tastings`, category: 'Catering', daysBeforeEvent: 20, priority: 'high' },
      { title: 'Dispatch Digital Invitations & RSVP Tokens', category: 'Guests', daysBeforeEvent: 15, priority: 'medium' },
      { title: 'Confirm AV Sound & Stage Lighting Crew', category: 'Media', daysBeforeEvent: 7, priority: 'low' },
    ],
    estimatedExpenses: [
      { category: 'Venue Rental', description: `Banquet / Lawn Hall in ${city}`, estimatedAmount: Math.round(budget * 0.35) },
      { category: 'Catering', description: `Full Food & Beverage Service (${guests} Guests)`, estimatedAmount: Math.round(budget * 0.35) },
      { category: 'Decor & Lighting', description: 'Stage, Floral Arch & Seating', estimatedAmount: Math.round(budget * 0.20) },
      { category: 'Miscellaneous', description: 'Contingency & Hospitality Desk', estimatedAmount: Math.round(budget * 0.10) },
    ]
  };
}
