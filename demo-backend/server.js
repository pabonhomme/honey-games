const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// --- Constants ---

const BADGE_POINTS = {
    'new-bee': 15,
    'early-riser': 100,
    'moonlighter': 30,
    'full-house': 500,
    'busy-bee': 100,
    'connector': 300,
    'pollinator': 300,
    'world-traveler': 500
};

// --- Initial Data ---

const mockUser = {
  _id: 'user-123',
  firstName: 'Jordan',
  lastName: 'Member',
  email: 'jordan@example.com',
  profilePictureUrl: 'https://avatar.vercel.sh/jordan',
  memberSinceISO: '2023-01-15T00:00:00.000Z',
  accounts: [{ _id: 'acc-1', name: 'Acme Corp' }],
  membershipType: 'member',
  primaryLocation: 'Flatiron',
  // New Fields
  daysStreak: 0, 
  activityPoints: 0,
  redeemedItems: [],
  earnedBadges: [],
  badgeProgress: {}, // { badgeId: currentCount }
  lastCheckInDate: null,
  totalBadgesAvailable: 8
};

// Initial seeded reservations
const seedReservations = [
  {
    _id: 'res-seed-1',
    reserverId: 'user-123',
    locationId: 'loc-nyc-flatiron',
    startDateISO: new Date(new Date().setHours(9)).toISOString(),
    endDateISO: new Date(new Date().setHours(17)).toISOString(),
    localStartDate: new Date().toISOString().split('T')[0],
    localEndDate: new Date().toISOString().split('T')[0],
    timezone: 'America/New_York',
    price: 45,
    status: 'Confirmed',
    checkInStatus: 'Checked In', // Active visit
    source: 'MemberPortal',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// --- Data Seeding Helpers ---

const getRandomDate = (year) => {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const createHistoricalVisit = (date, locationId = 'loc-nyc-flatiron') => ({
    _id: `hist-${date.getTime()}-${Math.random().toString(36).substr(2,4)}`,
    reserverId: 'user-123',
    locationId: locationId,
    startDateISO: date.toISOString(),
    endDateISO: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    localStartDate: date.toISOString().split('T')[0],
    timezone: locationId === 'loc-lon' ? 'Europe/London' : 
              locationId === 'loc-par' ? 'Europe/Paris' : 
              locationId === 'loc-tok' ? 'Asia/Tokyo' : 
              locationId === 'loc-ber' ? 'Europe/Berlin' : 
              locationId === 'loc-syn' ? 'Australia/Sydney' : 'America/New_York',
    price: 45,
    checkInStatus: 'Checked In',
    status: 'Confirmed'
});

// Scenario 1: 2024 - The Global Explorer
// Badges: World Traveler, Pollinator, New-Bee
const generate2024 = () => {
    const bookings = [];
    const earnedBadges = [];

    // 1. Trips (World Traveler)
    const trips = [
        { month: 2, loc: 'loc-lon' }, // March
        { month: 4, loc: 'loc-par' }, // May
        { month: 6, loc: 'loc-tok' }, // July
        { month: 8, loc: 'loc-syn' }, // Sept
        { month: 10, loc: 'loc-ber' } // Nov
    ];

    trips.forEach(trip => {
        // Generate a weeks worth of visits in that city
        const start = new Date(2024, trip.month, 10); // 10th of month
        for(let i=0; i<5; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            bookings.push(createHistoricalVisit(d, trip.loc)); // City visit
        }
    });

    // 2. Pollinator (NYC spread)
    // August visits to different NYC locations
    ['loc-nyc-flatiron', 'loc-nyc-soho', 'loc-nyc-midtown'].forEach((loc, i) => {
        const d = new Date(2024, 7, 15 + i); // Aug 15, 16, 17
        bookings.push(createHistoricalVisit(d, loc));
    });

    // 3. Filler visits (Home Base NYC) - 50 random visits
    for(let i=0; i<50; i++) {
        bookings.push(createHistoricalVisit(getRandomDate(2024)));
    }

    // Award Historical Badges (Dating them back)
    earnedBadges.push({ badgeId: 'new-bee', earnedAt: new Date(2024, 0, 15).toISOString() }); // First visit roughly
    earnedBadges.push({ badgeId: 'world-traveler', earnedAt: new Date(2024, 10, 15).toISOString() }); // Berlin time
    earnedBadges.push({ badgeId: 'pollinator', earnedAt: new Date(2024, 7, 20).toISOString() }); // Aug time

    return { bookings, earnedBadges };
};

// Scenario 2: 2025 - The Dedicated Pro
// Badges: Early Riser, Moonlighter, Full House, Busy Bee
const generate2025 = () => {
    const bookings = [];
    const earnedBadges = [];

    // 1. Full House: September 2025 fully booked
    // Sept 1 2025 is Monday. 
    for(let d=1; d<=30; d++) {
        const date = new Date(2025, 8, d); // Sept
        if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekend
        bookings.push(createHistoricalVisit(date));
    }

    // 2. Early Riser: March 10-14 2025 at 6AM
    for(let i=0; i<5; i++) {
        const d = new Date(2025, 2, 10 + i);
        d.setHours(6,0,0,0);
        bookings.push(createHistoricalVisit(d));
    }

    // 3. Moonlighter: Nov 2025 late nights
    for(let i=0; i<3; i++) {
        const d = new Date(2025, 10, 5 + i*3); // Spread out
        d.setHours(20,0,0,0);
        bookings.push(createHistoricalVisit(d));
    }

    // 4. Busy Bee: 3 Events
    // (We reuse createReservation logic essentially but push to list)
    [3, 6, 9].forEach(month => { // Apr, July, Oct
        const d = new Date(2025, month, 15, 9, 0); // 9AM event
        bookings.push({
            _id: `hist-event-2025-${month}`,
            reserverId: 'user-123',
            locationId: 'loc-nyc-flatiron',
            title: 'Community Breakfast',
            startDateISO: d.toISOString(),
            endDateISO: new Date(d.getTime() + 3600*1000).toISOString(),
            localStartDate: d.toISOString().split('T')[0],
            timezone: 'America/New_York',
            meetingRoomId: 'room-event-1',
            price: 0,
            status: 'Confirmed',
            checkInStatus: 'Checked In'
        });
    });

    // 5. Filler visits - 30 random
    for(let i=0; i<30; i++) {
        bookings.push(createHistoricalVisit(getRandomDate(2025)));
    }

    // Award Historical Badges
    earnedBadges.push({ badgeId: 'full-house', earnedAt: new Date(2025, 8, 30).toISOString() });
    earnedBadges.push({ badgeId: 'early-riser', earnedAt: new Date(2025, 2, 14).toISOString() });
    earnedBadges.push({ badgeId: 'moonlighter', earnedAt: new Date(2025, 10, 15).toISOString() });
    earnedBadges.push({ badgeId: 'busy-bee', earnedAt: new Date(2025, 9, 15).toISOString() });

    return { bookings, earnedBadges };
};
 
// Global state implementation
const data2024 = generate2024();
const data2025 = generate2025();

// Sort all historical bookings
const allHistoricalBookings = [...data2024.bookings, ...data2025.bookings].sort((a,b) => new Date(b.startDateISO) - new Date(a.startDateISO));

let state = {
  users: { 'user-123': mockUser },
  bookings: allHistoricalBookings, // Initially populated? Or only on reset? Let's populate initially for consistency if server restarts.
  visits: [], 
  badges: [],
  stats: { totalBookings: allHistoricalBookings.length, activeUsers: 0 }
};

// --- Core Logic ---

// STRICT Points Calculation
const calculatePoints = (user, bookings) => {
    let points = 0;
    
    // 1. Points from Check-ins (15 pts each)
    bookings.forEach(b => {
        if (b.checkInStatus === 'Checked In') {
            points += 15;
        }
    });

    // 2. Points from Earned Badges
    user.earnedBadges.forEach(badge => {
        points += (BADGE_POINTS[badge.badgeId] || 0);
    });
    
    return points;
};

// Real-time Badge Engine
const evaluateBadges = (user, bookings) => {
    const newBadges = [];
    const now = new Date();
    
    const hasBadge = (id) => user.earnedBadges.some(b => b.badgeId === id);
    
    const checkIns = bookings.filter(b => b.checkInStatus === 'Checked In');
    const sortedCheckIns = [...checkIns].sort((a, b) => new Date(a.startDateISO) - new Date(b.startDateISO));

    // 1. New-Bee (First check-in)
    // Only check if NOT triggered historically. 
    // If they have historical data but no badge record (unlikely with our generator), we'd award it "now".
    // But since generator provides the badge record, this won't fire for history.
    if (!hasBadge('new-bee') && checkIns.length > 0) {
        newBadges.push('new-bee');
    }

    // 2. Early Riser (5 consecutive check-ins before 8am)
    if (!hasBadge('early-riser')) {
        let streak = 0;
        for (const c of sortedCheckIns) {
            const d = new Date(c.startDateISO);
            if (d.getHours() < 8) {
                streak++;
                if (streak >= 5) {
                    newBadges.push('early-riser');
                    break;
                }
            } else {
                streak = 0;
            }
        }
    }

    // 3. Moonlighter (Check-in after 7pm)
    if (!hasBadge('moonlighter')) {
        const found = checkIns.some(c => {
            const d = new Date(c.startDateISO);
            return d.getHours() >= 19;
        });
        if (found) newBadges.push('moonlighter');
    }

    // 4. Pollinator & 5. World Traveler
    const locations = new Set(checkIns.map(c => c.locationId));
    const nycLocs = Array.from(locations).filter(l => l.startsWith('loc-nyc'));
    
    if (!hasBadge('pollinator') && nycLocs.length >= 3) {
        newBadges.push('pollinator');
    }
    
    if (!hasBadge('world-traveler') && locations.size >= 5) {
        newBadges.push('world-traveler');
    }

    // 6. Full House (Every business day of a month)
    if (!hasBadge('full-house')) {
        const confirmFullHouse = () => {
             const visitsByMonth = {};
             checkIns.forEach(c => {
                 const m = c.startDateISO.substring(0, 7); // YYYY-MM
                 visitsByMonth[m] = (visitsByMonth[m] || 0) + 1;
             });
             return Object.values(visitsByMonth).some(count => count >= 20); // Approx ~20 biz days
        };
        if (confirmFullHouse()) newBadges.push('full-house');
    }

    // 7. Busy Bee (3 community events)
    if (!hasBadge('busy-bee')) {
        const events = bookings.filter(b => b.title === 'Community Breakfast' || b.meetingRoomId === 'room-event-1');
        if (events.length >= 3) newBadges.push('busy-bee');
    }

    // Apply New Badges
    newBadges.forEach(id => {
        user.earnedBadges.push({ badgeId: id, earnedAt: now.toISOString() });
        user.activityPoints += (BADGE_POINTS[id] || 0);
    });

    return newBadges;
};


// --- Endpoints ---

const broadcastState = () => {
    state.stats.totalBookings = state.bookings.length;
    io.emit('state:update', state);
};

app.get('/state', (req, res) => {
  const { year } = req.query;
  // If no year, return everything for calculations
  // BUT: The frontend dashboard might want to filter strictly.
  // We'll let frontend do the visual filtering, but API can filter if asked.
  if (year) {
    const filterYear = parseInt(year);
    const filteredBookings = state.bookings.filter(b => new Date(b.startDateISO).getFullYear() === filterYear);
    
    // For badges: We only want to show badges EARNED in that year?
    // Or do we show all earned badges regardless?
    // User requested "different badges" based on year. This implies filtering.
    // Let's filter user.earnedBadges in the response too.
    
    const userCopy = JSON.parse(JSON.stringify(state.users['user-123']));
    if (userCopy.earnedBadges) {
        userCopy.earnedBadges = userCopy.earnedBadges.filter(b => b.earnedAt && new Date(b.earnedAt).getFullYear() === filterYear);
    }

    const filteredState = {
      ...state,
      users: { 'user-123': userCopy },
      bookings: filteredBookings,
      visits: state.visits.filter(v => new Date(v.startDateISO).getFullYear() === filterYear),
      stats: { ...state.stats, totalBookings: filteredBookings.length }
    };
    return res.json(filteredState);
  }
  res.json(state);
});

app.post('/reset', (req, res) => {
    // Regenerate fresh history on reset to ensure randomness/clean state
    const d24 = generate2024();
    const d25 = generate2025();
    const historyBookings = [...d24.bookings, ...d25.bookings];
    const historyBadges = [...d24.earnedBadges, ...d25.earnedBadges];

    // Combine with seed (2026 current/active)
    state.bookings = [...JSON.parse(JSON.stringify(seedReservations)), ...historyBookings];
    
    const user = state.users['user-123'];
    
    user.earnedBadges = historyBadges; // Restore historical badges
    user.redeemedItems = [];
    user.activityPoints = calculatePoints(user, state.bookings);
    
    // Re-evaluate to see if seed triggers anything (e.g. New-Bee if history didn't have it, but it does)
    evaluateBadges(user, state.bookings);
    
    broadcastState();
    res.json({ message: 'Reset complete', state });
});

app.post('/actions/reservation', (req, res) => {
    const reservation = createReservation(req.body);
    broadcastState();
    res.json({ message: 'Reservation created', reservation });
});

app.post('/actions/visit', (req, res) => {
    const visit = createVisit(req.body); 
    const user = state.users['user-123'];
    const newBadges = evaluateBadges(user, state.bookings);
    broadcastState();
    res.json({ message: 'Visit created', visit, newBadges, newBalance: user.activityPoints });
});

app.post('/actions/redeem', (req, res) => {
    const { itemId, cost, name } = req.body;
    const user = state.users['user-123'];
    if (user.activityPoints >= cost) {
        user.activityPoints -= cost;
        user.redeemedItems.push({ id: itemId, name, redeemDate: new Date().toISOString() });
        broadcastState();
        res.json({ success: true, message: `Redeemed ${name}`, newBalance: user.activityPoints });
    } else {
        res.status(400).json({ success: false, message: 'Insufficient points' });
    }
});

app.post('/actions/complete-badge', (req, res) => {
    const { badgeId } = req.body;
    const user = state.users['user-123'];
    const today = new Date();
    
    if (user.earnedBadges.some(b => b.badgeId === badgeId)) {
         return res.json({ message: 'Badge already earned', alreadyEarned: true });
    }

    let generatedCount = 0;

    switch (badgeId) {
        case 'early-riser':
            for (let i = 1; i <= 5; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                date.setHours(6, 0, 0, 0); 
                state.bookings.unshift(createMockVisit(date, 'loc-nyc-flatiron'));
                generatedCount++;
            }
            break;
        case 'moonlighter':
            const moonDate = new Date(today);
            moonDate.setHours(20, 0, 0, 0); 
            state.bookings.unshift(createMockVisit(moonDate, 'loc-nyc-flatiron'));
            generatedCount++;
            break;
        case 'world-traveler':
             const cities = [
                { id: 'loc-lon', tz: 'Europe/London' },
                { id: 'loc-par', tz: 'Europe/Paris' },
                { id: 'loc-tok', tz: 'Asia/Tokyo' },
                { id: 'loc-syn', tz: 'Australia/Sydney' },
                { id: 'loc-ber', tz: 'Europe/Berlin' }
            ];
            cities.forEach((c, i) => {
                const d = new Date(today);
                d.setDate(today.getDate() - (i+1)*7);
                state.bookings.unshift(createMockVisit(d, c.id));
                generatedCount++;
            });
            break;
        case 'pollinator':
            ['loc-nyc-flatiron', 'loc-nyc-soho', 'loc-nyc-midtown'].forEach((loc, i) => {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                state.bookings.unshift(createMockVisit(d, loc));
                generatedCount++;
            });
            break;
        case 'busy-bee':
            for(let i=0; i<3; i++) {
                 const d = new Date(today);
                 d.setDate(today.getDate() - i*5);
                 state.bookings.unshift({
                    _id: `auto-busybee-${i}`,
                    reserverId: 'user-123',
                    locationId: 'loc-nyc-flatiron',
                    title: 'Community Breakfast', 
                    startDateISO: d.toISOString(),
                    endDateISO: new Date(d.getTime() + 60*60*1000).toISOString(),
                    localStartDate: d.toISOString().split('T')[0],
                    timezone: 'America/New_York',
                    meetingRoomId: 'room-event-1', // Key for detection
                    price: 0,
                    status: 'Confirmed',
                    checkInStatus: 'Checked In' 
                 });
                 generatedCount++;
             }
             break;
         case 'full-house':
             const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
             for(let i=1; i<=22; i++) {
                 const d = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i);
                 state.bookings.unshift(createMockVisit(d, 'loc-nyc-flatiron'));
                 generatedCount++;
             }
             break;
    }
    
    user.activityPoints += (generatedCount * 15);
    const newBadges = evaluateBadges(user, state.bookings);
    
    broadcastState();
    res.json({ 
        message: `Simulated data for badge: ${badgeId}`, 
        generatedItems: generatedCount, 
        newBadges,
        newBalance: user.activityPoints 
    });
});


// --- Helpers Implementation ---

const createReservation = (data) => {
    const id = 'res-' + Date.now() + Math.random().toString(36).substr(2, 5);
    const now = new Date();
    const isMeetingRoom = data.type === 'meeting_room';
    const startDate = data.date ? new Date(data.date) : new Date(now.setHours(now.getHours() + 1));
    const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); 

    const reservation = {
        _id: id,
        reserverId: 'user-123',
        locationId: data.locationId || 'loc-nyc-flatiron',
        startDateISO: startDate.toISOString(),
        endDateISO: endDate.toISOString(),
        localStartDate: startDate.toISOString().split('T')[0],
        localEndDate: endDate.toISOString().split('T')[0],
        timezone: 'America/New_York',
        price: isMeetingRoom ? 75 : 45,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        ...(isMeetingRoom ? { meetingRoomId: 'room-101', title: 'Strategy Sync', nbAttendees: 3 } : {})
    };
    state.bookings.unshift(reservation);
    return reservation;
};

const createVisit = (data) => {
    const now = new Date();
    const visit = createMockVisit(now, data.locationId || 'loc-nyc-flatiron');
    state.bookings.unshift(visit);
    state.users['user-123'].activityPoints += 15;
    return visit;
};

const createMockVisit = (date, locationId) => {
    return {
       _id: 'visit-' + Date.now() + Math.random().toString(36).substr(2, 5),
       reserverId: 'user-123',
       locationId: locationId,
       startDateISO: date.toISOString(),
       endDateISO: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(),
       localStartDate: date.toISOString().split('T')[0],
       localEndDate: date.toISOString().split('T')[0],
       timezone: 'America/New_York',
       price: 45,
       status: 'Confirmed',
       checkInStatus: 'Checked In',
       createdAt: date.toISOString()
   };
};

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Demo backend running on http://localhost:${PORT}`);
});
