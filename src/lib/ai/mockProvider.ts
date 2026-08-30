import { AIService } from './provider';
import { TripRequest, TripPlan, DayItinerary, MapMarker, AccommodationOption, FoodHighlight, ActivityHighlight, SafetyInfo } from './types';
import { fetchOsrmRoute } from '../routing/osrm';

// Rich destination Knowledge Bases with multi-day unique templates
const DESTINATION_DATABASE: Record<string, {
  destination: string;
  tagline: string;
  mapCenter: [number, number];
  mapZoom: number;
  accommodations: AccommodationOption[];
  food: FoodHighlight[];
  activities: ActivityHighlight[];
  safety: SafetyInfo;
  markers: MapMarker[];
  dayTemplates: Array<{
    title: string;
    theme: string;
    activities: Array<{
      time: string;
      title: string;
      description: string;
      location: string;
      costRatio: number;
      category: 'food' | 'activity' | 'travel' | 'stay' | 'relaxation';
      coords?: [number, number];
    }>;
  }>;
}> = {
  coorg: {
    destination: "Coorg (Kodagu), Karnataka",
    tagline: "The Scotland of India - Coffee Plantations, Mist & Waterfalls",
    mapCenter: [12.4244, 75.7382],
    mapZoom: 11,
    accommodations: [
      { name: "Tamara Coorg Homestay", type: "Coffee Estate Stay", pricePerNight: 3200, rating: 4.8, description: "Authentic estate living surrounded by silver oak trees & pepper vines.", location: "Madikeri" },
      { name: "Coffee County Heritage", type: "Boutique Resort", pricePerNight: 4500, rating: 4.7, description: "Wooden cottages over misty valley views with campfire access.", location: "Somwarpet" },
      { name: "Zostel Coorg", type: "Backpacker Hostel", pricePerNight: 950, rating: 4.6, description: "Vibrant social hub for group travelers and nature lovers.", location: "Madikeri" }
    ],
    food: [
      { dishOrPlace: "Pandi Curry (Pork in Kampalapura Masala)", description: "Coorg's iconic signature dark roasted dish with Kachampuli vinegar.", estimatedCost: 450, type: "must-try-dish" },
      { dishOrPlace: "Kadambuttu & Bamboo Shoot Curry", description: "Steamed rice dumplings paired with spicy monsoon bamboo curry.", estimatedCost: 280, type: "must-try-dish" },
      { dishOrPlace: "Raily's Plantation Cafe", description: "Fresh single-origin Arabica coffee & home-baked cardamom cake.", estimatedCost: 350, type: "restaurant" }
    ],
    activities: [
      { title: "Abbey Waterfalls Trek", category: "Nature Trek", duration: "2 Hours", description: "Walk through spice plantations down to cascading white waterfalls.", costPerPerson: 100 },
      { title: "Mandalpatti 4x4 Off-Road Jeep Safari", category: "Adventure", duration: "3 Hours", description: "Thrilling jeep climb to panoramic cloud-covered ridge tops.", costPerPerson: 750 },
      { title: "Dubare Elephant Camp River Rafting", category: "River Sports", duration: "2.5 Hours", description: "Mild whitewater rafting and elephant bathing along Kaveri river.", costPerPerson: 900 }
    ],
    safety: {
      overallSafetyIndex: 94,
      emergencyContacts: [
        { name: "Madikeri District Hospital", number: "+91 8272 225333" },
        { name: "Tourist Helpline Coorg", number: "112 / +91 8272 228334" }
      ],
      localTips: [
        "Carry light rain jacket and sturdy grip footwear for slippery trails.",
        "Leeches are common during damp season; apply salt or eucalyptus oil.",
        "Mountain roads have sharp curves; keep drive speed under 40 km/h."
      ],
      weatherAdvisory: "Pleasant misty mornings (18°C - 24°C). Light evening showers possible.",
      healthTips: ["Keep hydrated with bottled or boiled spring water.", "Carry anti-motion sickness pills for hairpin bends."]
    },
    markers: [
      { id: "m1", title: "Abbey Waterfalls", type: "attraction", lat: 12.456, lng: 75.72, description: "Roaring waterfall nestled amidst spice plantations.", day: 1 },
      { id: "m2", title: "Mandalpatti Peak", type: "attraction", lat: 12.56, lng: 75.78, description: "Panoramic viewpoint above clouds accessible via 4x4 jeep.", day: 2 },
      { id: "m3", title: "Dubare River Camp", type: "attraction", lat: 12.368, lng: 75.9, description: "Kaveri river bank elephant interaction & rafting base.", day: 3 },
      { id: "m4", title: "Madikeri Fort & Raja's Seat", type: "attraction", lat: 12.421, lng: 75.739, description: "Historical fort complex & sunset valley viewpoint.", day: 1 }
    ],
    dayTemplates: [
      {
        title: "Day 1: Scenic Drive & Mist-Shrouded Waterfalls",
        theme: "Arrival & Spice Plantation Exploration",
        activities: [
          { time: "07:30 AM", title: "Depart Origin & Highway Breakfast", description: "Scenic drive via Sampaje ghats with Neer Dosa & Filter Coffee stop.", location: "Highway Stop", costRatio: 0.05, category: "travel", coords: [12.87, 75.05] },
          { time: "11:30 AM", title: "Check-in at Coffee Estate Homestay", description: "Welcome spiced herbal drink & estate orientation walk.", location: "Madikeri Estate", costRatio: 0.25, category: "stay", coords: [12.42, 75.73] },
          { time: "02:00 PM", title: "Abbey Waterfalls & Spice Trail Trek", description: "Hike through nutmeg and black pepper thickets to the roaring fall.", location: "Abbey Falls", costRatio: 0.08, category: "activity", coords: [12.456, 75.72] },
          { time: "06:30 PM", title: "Sunset at Raja's Seat & Kodava Dinner", description: "Panoramic valley sunset followed by authentic Pandi Curry dinner.", location: "Raja's Seat", costRatio: 0.12, category: "food", coords: [12.421, 75.739] }
        ]
      },
      {
        title: "Day 2: 4x4 Cloud Safari & High Peak Ridge Walk",
        theme: "High Altitude Adventure & Local Culinary Trail",
        activities: [
          { time: "05:30 AM", title: "Mandalpatti Sunrise 4x4 Jeep Expedition", description: "Off-road ride up rugged trail for sunrise above rolling cloud sea.", location: "Mandalpatti Ridge", costRatio: 0.15, category: "activity", coords: [12.56, 75.78] },
          { time: "09:30 AM", title: "Traditional Akki Oti & Honey Breakfast", description: "Hot rice flatbreads served with wild forest honey and melted ghee.", location: "Madikeri Town", costRatio: 0.05, category: "food", coords: [12.424, 75.738] },
          { time: "01:30 PM", title: "Golden Temple (Namdroling Monastery) Visit", description: "Explore giant 40ft gilded Buddha statues & Tibetan handicrafts.", location: "Bylakuppe", costRatio: 0.06, category: "activity", coords: [12.434, 75.964] },
          { time: "07:30 PM", title: "Estate Campfire & Barbecue Under Stars", description: "Group campfire session with local roasted treats & acoustic music.", location: "Homestay Lawn", costRatio: 0.10, category: "relaxation", coords: [12.42, 75.73] }
        ]
      },
      {
        title: "Day 3: River Rafting & Elephant Camp Interaction",
        theme: "Kaveri River Adventure",
        activities: [
          { time: "08:30 AM", title: "Dubare Elephant Camp & River Crossing", description: "Cross Kaveri river on boats to assist in elephant bathing & feeding.", location: "Dubare Camp", costRatio: 0.12, category: "activity", coords: [12.368, 75.9] },
          { time: "01:00 PM", title: "Riverside Bamboo Shoot & Fish Lunch", description: "Feast on freshly caught Kaveri fish fry & traditional curry.", location: "Kaveri Bank Restaurant", costRatio: 0.08, category: "food", coords: [12.37, 75.91] },
          { time: "03:30 PM", title: "Whitewater River Rafting Run", description: "Action-packed Class II river rafting rapids down Kaveri river.", location: "Dubare Rafting Base", costRatio: 0.14, category: "activity", coords: [12.365, 75.89] },
          { time: "08:00 PM", title: "Cafe Hopping & Coffee Tasting Session", description: "Sample roasted Robusta and Arabica blends at local roasters.", location: "Madikeri Market", costRatio: 0.08, category: "food", coords: [12.424, 75.738] }
        ]
      },
      {
        title: "Day 4: Iruppu Waterfalls & Brahmagiri Wildlife Trail",
        theme: "Southern Coorg Forest Exploration",
        activities: [
          { time: "08:30 AM", title: "Scenic Drive to Southern Coorg", description: "Drive past sprawling tea gardens toward Nagarhole border.", location: "Gonikoppal Highway", costRatio: 0.06, category: "travel", coords: [12.18, 75.92] },
          { time: "11:00 AM", title: "Iruppu Sacred Waterfalls Dip", description: "Trek through dense bamboo forests to sacred Lakshmana Tirtha falls.", location: "Iruppu Falls", costRatio: 0.08, category: "activity", coords: [11.97, 75.98] },
          { time: "02:00 PM", title: "Traditional Kodava Meals at Kutta", description: "Local thali meal featuring Coorg bamboo shoots & wild yam.", location: "Kutta Town", costRatio: 0.08, category: "food", coords: [11.96, 76.01] },
          { time: "06:30 PM", title: "Tadiandamol Base Camp Sunset View", description: "Unwind watching sunset over Western Ghats mountain shadows.", location: "Kakkabe Valley", costRatio: 0.08, category: "relaxation", coords: [12.21, 75.63] }
        ]
      },
      {
        title: "Day 5: Tadiandamol Peak Trek & Heritage Palace",
        theme: "Highest Peak Conquer & History Trail",
        activities: [
          { time: "06:00 AM", title: "Tadiandamol Mountain Summit Hike", description: "Hike up Coorg's highest mountain peak through shola forests.", location: "Tadiandamol Peak", costRatio: 0.15, category: "activity", coords: [12.21, 75.63] },
          { time: "01:30 PM", title: "Nalknad Palace Historical Tour", description: "Explore 18th-century royal retreat of Kodava kings with carved pillars.", location: "Kakkabe Palace", costRatio: 0.06, category: "activity", coords: [12.23, 75.65] },
          { time: "07:30 PM", title: "Private Estate Barbecue & Stargazing", description: "Rest weary legs by campfire with hot soup and grilled veggies.", location: "Valley Homestay", costRatio: 0.10, category: "relaxation", coords: [12.42, 75.73] }
        ]
      },
      {
        title: "Day 6: Talakaveri Sacred River Source & Nishani Motte",
        theme: "Spiritual Origins & Ridge Trekking",
        activities: [
          { time: "08:00 AM", title: "Talakaveri & Brahmagiri Hill Stairs Hike", description: "Visit birthplace of Kaveri river and climb 350 steps for 360° views.", location: "Talakaveri", costRatio: 0.08, category: "activity", coords: [12.38, 75.49] },
          { time: "12:30 PM", title: "Bhagamandala Triveni Sangama Temple Visit", description: "Confluence of Kaveri, Kanake and Sujyoti rivers with woodcarved shrine.", location: "Bhagamandala", costRatio: 0.05, category: "activity", coords: [12.39, 75.53] },
          { time: "06:30 PM", title: "Artisanal Coffee Roasting & Spice Shopping", description: "Purchase fresh cardamom, vanilla pods, and organic Robusta beans.", location: "Madikeri Bazaar", costRatio: 0.10, category: "relaxation", coords: [12.425, 75.737] }
        ]
      },
      {
        title: "Day 7: Farewell Plantation Breakfast & Departure",
        theme: "Souvenir Shopping & Return Journey",
        activities: [
          { time: "09:00 AM", title: "Coffee Estate Processing Tour & Tasting", description: "Learn pulping, roasting, and bean selection with master coffee growers.", location: "Heritage Estate", costRatio: 0.08, category: "activity", coords: [12.42, 75.73] },
          { time: "11:30 AM", title: "Local Spice & Homemade Chocolate Market", description: "Shop for organic black pepper, cardamom, vanilla, and chocolates.", location: "Madikeri Bazaar", costRatio: 0.10, category: "relaxation", coords: [12.425, 75.737] },
          { time: "01:30 PM", title: "Farewell South Indian Thali Lunch", description: "Lavish banana leaf meal with fresh coconut chutneys.", location: "Neelakanta Restaurant", costRatio: 0.07, category: "food", coords: [12.422, 75.736] },
          { time: "03:30 PM", title: "Return Drive to Origin", description: "Relaxing drive back through scenic mountain passes arriving by evening.", location: "Return Highway", costRatio: 0.05, category: "travel", coords: [12.87, 74.88] }
        ]
      }
    ]
  },
  gokarna: {
    destination: "Gokarna & Kudle Coast, Karnataka",
    tagline: "Pristine Beach Treks, Cliffside Sunset Cafes & Coastal Vibe",
    mapCenter: [14.5479, 74.3188],
    mapZoom: 12,
    accommodations: [
      { name: "Kudle Beach Cliffside Cottages", type: "Beach Cottage", pricePerNight: 2800, rating: 4.7, description: "Overlooking Kudle beach waves with hammock balconies.", location: "Kudle Beach" },
      { name: "Om Beach Ocean Resort", type: "Eco Beach Resort", pricePerNight: 4200, rating: 4.8, description: "Direct beach access nestled among palm groves.", location: "Om Beach" },
      { name: "Hostel Nomad Gokarna", type: "Hostel", pricePerNight: 850, rating: 4.5, description: "Surf vibed hostel on Paradise beach trail.", location: "Gokarna Town" }
    ],
    food: [
      { dishOrPlace: "Namaste Cafe Seafood Platter", description: "Freshly caught grilled kingfish & butter garlic prawns on Om Beach.", estimatedCost: 650, type: "restaurant" },
      { dishOrPlace: "Gokarna Prawn Curry & Rice", description: "Coastal coconut & kokum spiced prawn curry.", estimatedCost: 380, type: "must-try-dish" },
      { dishOrPlace: "Chez Christophe Bakery", description: "French wood-fired croissants & artisanal vegan smoothie bowls.", estimatedCost: 320, type: "restaurant" }
    ],
    activities: [
      { title: "Five Beach Trek (Kudle to Paradise)", category: "Coastal Hiking", duration: "4 Hours", description: "Hike over rocky ocean cliffs connecting 5 untouched golden beaches.", costPerPerson: 200 },
      { title: "Sunset Kayaking & Bioluminescence", category: "Water Adventure", duration: "2 Hours", description: "Paddle out into Arabian sea waves during golden hour.", costPerPerson: 850 },
      { title: "Sharavathi Backwater Boat Cruise", category: "Scenic Cruise", duration: "3 Hours", description: "Explore mangrove islands near Honnavar en route.", costPerPerson: 500 }
    ],
    safety: {
      overallSafetyIndex: 91,
      emergencyContacts: [
        { name: "Gokarna Coastal Police Station", number: "+91 8386 256333" },
        { name: "Community Health Centre Gokarna", number: "+91 8386 256221" }
      ],
      localTips: [
        "High tides at Paradise & Half Moon beaches make rocks slippery; trek with proper footwear.",
        "Respect local temple zones (Mahabaleshwar temple area requires modest attire).",
        "Keep cash handy as mobile network in cliff beaches can be patchy."
      ],
      weatherAdvisory: "Sunny coastal breeze (24°C - 31°C). High UV rating near noon.",
      healthTips: ["Use broad-spectrum sunscreen SPF 50+", "Stay hydrated with fresh tender coconut water."]
    },
    markers: [
      { id: "g1", title: "Kudle Beach", type: "attraction", lat: 14.538, lng: 74.314, description: "Vast crescent beach flanked by rocky hillocks.", day: 1 },
      { id: "g2", title: "Om Beach", type: "attraction", lat: 14.526, lng: 74.318, description: "Naturally shaped like spiritual Om symbol with beachfront cafes.", day: 2 },
      { id: "g3", title: "Paradise Beach", type: "attraction", lat: 14.512, lng: 74.329, description: "Secluded cliff-enclosed beach accessible by trek or boat.", day: 2 },
      { id: "g4", title: "Honnavar Mangrove Boardwalk", type: "attraction", lat: 14.281, lng: 74.444, description: "Scenic estuarine mangrove boardwalk trail.", day: 3 }
    ],
    dayTemplates: [
      {
        title: "Day 1: Coastal Drive & Sunset Cliffside Chilling",
        theme: "Highway Cruise & Kudle Beach Arrival",
        activities: [
          { time: "08:00 AM", title: "Drive via Scenic NH66 Coastal Highway", description: "Cruise past Maravanthe where ocean meets river on both sides.", location: "Maravanthe Beach Road", costRatio: 0.06, category: "travel", coords: [13.71, 74.64] },
          { time: "01:00 PM", title: "Check-in & Fresh Seafood Lunch", description: "Settle into cliff cottages and enjoy pomfret fry.", location: "Kudle Beach Cafe", costRatio: 0.22, category: "food", coords: [14.538, 74.314] },
          { time: "04:30 PM", title: "Kudle Beach Walk & Sunset Frisbee", description: "Golden sand leisure walk, dip in sea waves & beach volleyball.", location: "Kudle Beach", costRatio: 0.05, category: "activity", coords: [14.538, 74.314] },
          { time: "08:00 PM", title: "Cliffside Live Music & Candlelight Dinner", description: "Chilled acoustic sessions under palm tree lights.", location: "Mantra Cafe", costRatio: 0.14, category: "food", coords: [14.539, 74.315] }
        ]
      },
      {
        title: "Day 2: Iconic 5-Beach Cliff Trek & Om Beach Kayaking",
        theme: "Adventure Beach Trek & Water Sports",
        activities: [
          { time: "06:30 AM", title: "Guided 5-Beach Cliff Trek", description: "Hike over cliffs from Kudle -> Om -> Half Moon -> Paradise Beach.", location: "Gokarna Coastal Trail", costRatio: 0.10, category: "activity", coords: [14.526, 74.318] },
          { time: "11:00 AM", title: "Chill Out Smoothies at Paradise Beach", description: "Recharge with fresh fruit smoothies in secluded cove.", location: "Paradise Beach Cove", costRatio: 0.06, category: "relaxation", coords: [14.512, 74.329] },
          { time: "04:00 PM", title: "Sunset Kayaking at Om Beach", description: "Sea kayaking out into open waters as orange sun sets over horizon.", location: "Om Beach", costRatio: 0.16, category: "activity", coords: [14.526, 74.318] },
          { time: "08:00 PM", title: "Namaste Cafe Famous Dinner", description: "Woodfired pizza and butter garlic crab on beach lounge beds.", location: "Namaste Cafe Om Beach", costRatio: 0.15, category: "food", coords: [14.527, 74.319] }
        ]
      },
      {
        title: "Day 3: Temple Culture & Honnavar Mangrove Backwaters",
        theme: "Heritage & Backwater Exploration",
        activities: [
          { time: "08:30 AM", title: "Mahabaleshwar Temple & Heritage Walk", description: "Visit ancient 4th-century Shiva temple & traditional car street.", location: "Gokarna Town", costRatio: 0.04, category: "activity", coords: [14.547, 74.318] },
          { time: "11:30 AM", title: "Drive to Honnavar Backwaters", description: "Short drive south to mangrove delta ecosystem.", location: "Honnavar", costRatio: 0.05, category: "travel", coords: [14.281, 74.444] },
          { time: "02:00 PM", title: "Sharavathi River Boat Safari & Boardwalk", description: "Eco-boat tour through lush green mangrove tunnels.", location: "Kandla Mangrove Park", costRatio: 0.15, category: "activity", coords: [14.281, 74.444] },
          { time: "07:30 PM", title: "Beachside Campfire & Star Gazing", description: "Night bonfire on serene beach with acoustic guitar jams.", location: "Gokarna Main Beach", costRatio: 0.10, category: "relaxation", coords: [14.548, 74.315] }
        ]
      },
      {
        title: "Day 4: Yana Monolithic Rocks & Vibhooti Waterfalls Trek",
        theme: "Western Ghats Geological Wonders",
        activities: [
          { time: "08:00 AM", title: "Drive into Dense Sahyadri Forests", description: "Inland forest drive toward unique black karst rock monoliths.", location: "Yana Forest Road", costRatio: 0.08, category: "travel", coords: [14.59, 74.56] },
          { time: "10:30 AM", title: "Yana Giant Rock Monolith Cave Walk", description: "Trek under 120-meter high sharp black limestone peaks.", location: "Yana Caves", costRatio: 0.12, category: "activity", coords: [14.59, 74.56] },
          { time: "02:30 PM", title: "Vibhooti Forest Waterfalls Natural Pool Swim", description: "Cool off swimming in emerald green jungle waterfall pools.", location: "Vibhooti Falls", costRatio: 0.08, category: "activity", coords: [14.61, 74.54] },
          { time: "07:30 PM", title: "Beachside Barbecue & Sunset Mocktails", description: "Relax at Kudle cliff lounge watching waves under twilight.", location: "Kudle Sunset Bar", costRatio: 0.12, category: "food", coords: [14.538, 74.314] }
        ]
      },
      {
        title: "Day 5: Morning Surf/Yoga & Scenic Coastal Return",
        theme: "Wellness & Return Journey",
        activities: [
          { time: "07:00 AM", title: "Sunrise Beach Yoga & Ocean Dip", description: "Refreshing ocean stretch & swimming in calm morning tide.", location: "Kudle Beach", costRatio: 0.04, category: "relaxation", coords: [14.538, 74.314] },
          { time: "10:00 AM", title: "Artisanal Bakery Breakfast", description: "Freshly brewed coffee & French flaky pastry breakfast.", location: "Chez Christophe", costRatio: 0.08, category: "food", coords: [14.542, 74.316] },
          { time: "01:30 PM", title: "Udupi Temple & Mitra Samaj Lunch", description: "Halt at Udupi for world-famous Masala Dosa & Goli Baje.", location: "Udupi Car Street", costRatio: 0.08, category: "food", coords: [13.34, 74.74] },
          { time: "04:30 PM", title: "Arrive back in Origin", description: "End trip with unforgettable memories of the coastal trek.", location: "Return City", costRatio: 0.04, category: "travel", coords: [12.87, 74.88] }
        ]
      }
    ]
  }
};

export class MockAIService implements AIService {
  name = 'NUVAY Rule-Based Engine (Fallback)';

  async parseNaturalPrompt(prompt: string): Promise<Partial<TripRequest>> {
    const lower = prompt.toLowerCase();
    
    // Task 1: Robust Budget Parsing
    let budget = 20000;
    // Look for explicit currency or quantity specifiers: ₹20,000, 20k, 20000, 20,000 INR
    const currencyMatch = lower.match(/(?:₹|rs\.?|inr|budget|of)?\s*([\d,]+)\s*(k|thousand|lakh|rupees|inr)?/i);
    if (currencyMatch) {
      let rawStr = currencyMatch[1].replace(/,/g, '');
      let val = parseInt(rawStr, 10);
      const unit = (currencyMatch[2] || '').toLowerCase();

      if (!isNaN(val)) {
        if (unit === 'k' || lower.includes(rawStr + 'k')) {
          val = val * 1000;
        } else if (unit === 'lakh' || lower.includes('lakh')) {
          val = val * 100000;
        } else if (val < 100 && !lower.includes('day') && !lower.includes('friend')) {
          val = val * 1000;
        }
        if (val >= 2000) {
          budget = val;
        }
      }
    }

    // Task 1: Robust Duration Days Parsing
    let durationDays = 4;
    const daysMatch = lower.match(/\b(\d+)\s*(?:days|day|d)\b/);
    if (daysMatch) {
      const parsedDays = parseInt(daysMatch[1], 10);
      if (!isNaN(parsedDays) && parsedDays > 0) {
        durationDays = Math.min(parsedDays, 14); // Allow up to 14 days
      }
    }

    // Task 1: Robust Group & Traveler Count Parsing
    let travelersCount = 3;
    let travelerType: TripRequest['travelerType'] = 'Friends';
    
    const groupMatch = lower.match(/\b(\d+)\s*(?:friends|people|persons|buddies|pax|travelers|members)\b/);
    if (groupMatch) {
      travelersCount = parseInt(groupMatch[1], 10);
    }
    
    if (lower.includes('solo') || lower.includes('myself') || lower.includes('alone')) {
      travelersCount = 1;
      travelerType = 'Solo';
    } else if (lower.includes('couple') || lower.includes('partner') || lower.includes('wife') || lower.includes('husband')) {
      travelersCount = 2;
      travelerType = 'Couple';
    } else if (lower.includes('family') || lower.includes('kids') || lower.includes('parents')) {
      travelerType = 'Family';
      if (!groupMatch) travelersCount = 4;
    }

    // Task 1: Origin Parsing
    let origin = "Mangalore";
    const originMatch = lower.match(/(?:from|starting from|starting|leaving)\s+([a-zA-Z\s]+?)(?:\.|\,|$|\s+we|\s+with|\s+want|\s+for|\s+to)/);
    if (originMatch) {
      const rawOrigin = originMatch[1].trim();
      if (rawOrigin.length > 2 && rawOrigin.length < 25) {
        origin = rawOrigin.charAt(0).toUpperCase() + rawOrigin.slice(1);
      }
    }

    // Task 1: Vibes Parsing
    const vibes: string[] = [];
    if (lower.includes('nature') || lower.includes('forest') || lower.includes('green') || lower.includes('plantation')) vibes.push('Nature');
    if (lower.includes('adventure') || lower.includes('trek') || lower.includes('rafting') || lower.includes('jeep')) vibes.push('Adventure');
    if (lower.includes('food') || lower.includes('culinary') || lower.includes('eat') || lower.includes('seafood')) vibes.push('Good Food');
    if (lower.includes('beach') || lower.includes('ocean') || lower.includes('sea') || lower.includes('coast')) vibes.push('Beach');
    if (vibes.length === 0) vibes.push('Nature', 'Adventure', 'Good Food');

    return {
      prompt,
      budget,
      currency: '₹',
      durationDays,
      travelersCount,
      travelerType,
      origin,
      vibes,
      pace: 'Balanced',
      accommodationType: budget < 15000 ? 'Budget' : budget < 35000 ? 'Homestay' : 'Boutique'
    };
  }

  async generateTripPlan(request: TripRequest): Promise<TripPlan> {
    const parsed = await this.parseNaturalPrompt(request.prompt);
    
    // Merge parsed attributes with any explicit overrides
    const budget = request.budget || parsed.budget || 20000;
    const durationDays = request.durationDays || parsed.durationDays || 4;
    const travelersCount = request.travelersCount || parsed.travelersCount || 3;
    const travelerType = request.travelerType || parsed.travelerType || 'Friends';
    const origin = request.origin || parsed.origin || 'Mangalore';
    const currency = request.currency || '₹';

    // Select destination database key based on vibes/keywords
    const isBeach = request.prompt.toLowerCase().includes('beach') || request.prompt.toLowerCase().includes('gokarna') || request.prompt.toLowerCase().includes('sea');
    const key = isBeach ? 'gokarna' : 'coorg';
    const data = DESTINATION_DATABASE[key];

    // Compute Itemized Budget Breakdown
    const totalEst = Math.round(budget * 0.95);
    const budgetBreakdown = {
      transportation: Math.round(totalEst * 0.22),
      accommodation: Math.round(totalEst * 0.38),
      food: Math.round(totalEst * 0.22),
      activities: Math.round(totalEst * 0.12),
      contingency: Math.round(totalEst * 0.06),
    };

    // Task 5: Build UNIQUE non-repeating day itineraries up to requested durationDays
    const dayItineraries: DayItinerary[] = [];
    const templatePool = data.dayTemplates;

    for (let d = 1; d <= durationDays; d++) {
      let template;

      if (d <= templatePool.length) {
        template = templatePool[d - 1];
      } else {
        // Generate procedural non-repeating days if duration exceeds available templates
        const extraDayNum = d;
        template = {
          title: `Day ${extraDayNum}: Off-the-Beaten-Path Exploration in ${data.destination.split(',')[0]}`,
          theme: `Hidden Gems & Local Culture - Part ${extraDayNum - templatePool.length}`,
          activities: [
            {
              time: "08:30 AM",
              title: `Day ${extraDayNum} Morning Eco Trail & Local Breakfast`,
              description: `Guided walk through lesser-known forest sanctuaries followed by hot regional breakfast.`,
              location: `${data.destination.split(',')[0]} Rural Reserve`,
              costRatio: 0.08,
              category: "activity" as const,
              coords: [data.mapCenter[0] + (d * 0.01), data.mapCenter[1] + (d * 0.01)] as [number, number]
            },
            {
              time: "01:30 PM",
              title: `Day ${extraDayNum} Artisan Workshop & Countryside Lunch`,
              description: `Visit local handicraft weavers and enjoy authentic homemade regional thali.`,
              location: `${data.destination.split(',')[0]} Village Center`,
              costRatio: 0.10,
              category: "food" as const,
              coords: [data.mapCenter[0] - (d * 0.01), data.mapCenter[1] - (d * 0.01)] as [number, number]
            },
            {
              time: "06:30 PM",
              title: `Day ${extraDayNum} Sunset Point & Fireside Evening`,
              description: `Quiet sunset vantage point followed by relaxing campfire and local snacks.`,
              location: `Panoramas of ${data.destination.split(',')[0]}`,
              costRatio: 0.12,
              category: "relaxation" as const,
              coords: [data.mapCenter[0], data.mapCenter[1]] as [number, number]
            }
          ]
        };
      }

      const daySchedule = template.activities.map(act => ({
        time: act.time,
        title: act.title,
        description: act.description,
        location: act.location,
        costPerPerson: Math.round((budget / (durationDays * travelersCount)) * act.costRatio * 1.5),
        category: act.category,
        coordinates: act.coords
      }));

      dayItineraries.push({
        day: d,
        title: template.title,
        theme: template.theme,
        schedule: daySchedule
      });
    }

    // Task 4: Dynamic OSRM Route Calculation
    const route = await fetchOsrmRoute(origin, data.destination.split(',')[0]);

    return {
      id: `nuvay-trip-${Date.now()}`,
      title: `${durationDays}-Day ${travelerType} Expedition to ${data.destination.split(',')[0]}`,
      tagline: data.tagline,
      destination: data.destination,
      origin: origin,
      durationDays: durationDays,
      travelersCount: travelersCount,
      travelerType: travelerType,
      totalBudgetEstimate: totalEst,
      requestedBudget: budget,
      currency: currency,
      budgetBreakdown: budgetBreakdown,
      routeInfo: {
        origin: origin,
        destination: data.destination.split(',')[0],
        distanceKm: route.distanceKm,
        estimatedDriveHours: route.estimatedDriveHours,
        suggestedModes: route.suggestedModes,
        waypoints: route.waypoints,
      },
      dayItineraries: dayItineraries,
      accommodationSuggestions: data.accommodations,
      foodHighlights: data.food,
      activitiesHighlights: data.activities,
      safetyInfo: data.safety,
      mapCenter: data.mapCenter,
      mapZoom: data.mapZoom,
      markers: data.markers,
      createdAt: new Date().toISOString()
    };
  }
}
