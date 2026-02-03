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
  primaryLocation: 'Flatiron'
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

// --- Data Seeding ---

// Helper to generate random past date within a year
const getRandomDate = (year) => {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateHistoricalData = () => {
    const bookings = [];
    
    // 2024: The "Road Warrior" Year (150 visits, 3 cities)
    for (let i = 0; i < 150; i++) {
        const date = getRandomDate(2024);
        const location = Math.random() > 0.8 ? 'loc-lon' : 'loc-nyc-flatiron'; // Mostly NYC, some London
        bookings.push({
            _id: `hist-2024-${i}`,
            reserverId: 'user-123',
            locationId: location,
            startDateISO: date.toISOString(),
            endDateISO: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(),
            localStartDate: date.toISOString().split('T')[0],
            timezone: location === 'loc-lon' ? 'Europe/London' : 'America/New_York',
            price: 45,
            checkInStatus: 'Checked In',
            status: 'Confirmed'
        });
    }

    // 2025: The "Meeting Heavy" Year (50 visits, but 100 meeting rooms)
    for (let i = 0; i < 50; i++) {
        const date = getRandomDate(2025);
        bookings.push({
            _id: `visit-2025-${i}`,
            reserverId: 'user-123',
            locationId: 'loc-nyc-flatiron',
            startDateISO: date.toISOString(),
            endDateISO: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(),
            localStartDate: date.toISOString().split('T')[0],
            timezone: 'America/New_York',
            price: 45,
            checkInStatus: 'Checked In',
            status: 'Confirmed'
        });
    }
    for (let i = 0; i < 100; i++) {
        const date = getRandomDate(2025);
        bookings.push({
             _id: `meeting-2025-${i}`,
             reserverId: 'user-123',
             locationId: 'loc-nyc-flatiron',
             meetingRoomId: 'room-101',
             title: 'Project Sync',
             startDateISO: date.toISOString(),
             endDateISO: new Date(date.getTime() + 1 * 60 * 60 * 1000).toISOString(),
             localStartDate: date.toISOString().split('T')[0],
             timezone: 'America/New_York',
             price: 75,
             status: 'Confirmed'
         });
    }

    // 2026: Current Year (Started slow, ramping up)
    for (let i = 0; i < 20; i++) {
        const date = getRandomDate(2026);
        // Ensure date is not in future relative to "now" (simulated)
        if (date > new Date()) continue; 
        
        bookings.push({
            _id: `curr-2026-${i}`,
            reserverId: 'user-123',
            locationId: 'loc-nyc-flatiron',
            startDateISO: date.toISOString(),
            endDateISO: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(),
            localStartDate: date.toISOString().split('T')[0],
            timezone: 'America/New_York',
            price: 45,
            checkInStatus: 'Checked In',
            status: 'Confirmed'
        });
    }

    // Sort by date descending
    return bookings.sort((a, b) => new Date(b.startDateISO) - new Date(a.startDateISO));
};

const historicalBookings = generateHistoricalData();

let state = {
  users: { 'user-123': mockUser },
  bookings: historicalBookings,
  visits: [], 
  badges: [],
  stats: {
    totalBookings: historicalBookings.length,
    activeUsers: 0
  },
  leaderboard: []
};

// --- Helpers ---

const broadcastState = () => {
    // Recalculate stats on every update for simplicity
    state.stats.totalBookings = state.bookings.length;
    io.emit('state:update', state);
};

const createReservation = (data) => {
    const id =     'res-' + Date.now() + Math.random().toString(36).substr(2, 5);
    const now = new Date();
    
    // Default to future booking if no date provided
    // If we want a past booking, we must pass it
    // Logic: meeting_room vs day_pass
    
    const isMeetingRoom = data.type === 'meeting_room';
    
    // Default duration
    const startDate = data.date ? new Date(data.date) : new Date(now.setHours(now.getHours() + 1));
    const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // 1 hour

    const reservation = {
        _id: id,
        reserverId: 'user-123', // Hardcoded for demo
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
   const id = 'res-visit-' + Date.now() + Math.random().toString(36).substr(2, 5);
   const now = new Date();
   
   // A visit is essentially a past/current reservation that is Checked In
   const reservation = {
       _id: id,
       reserverId: 'user-123',
       locationId: data.locationId || 'loc-nyc-flatiron',
       startDateISO: now.toISOString(),
       endDateISO: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
       localStartDate: now.toISOString().split('T')[0],
       localEndDate: now.toISOString().split('T')[0],
       timezone: 'America/New_York',
       price: 45,
       status: 'Confirmed',
       checkInStatus: 'Checked In',
       createdAt: now.toISOString()
   };
   
   state.bookings.unshift(reservation); // Add to bookings list as verified visit
   return reservation;
};


// --- Endpoints ---

app.get('/state', (req, res) => {
  const { year } = req.query;
  
  if (year) {
    const filterYear = parseInt(year);
    // Filter bookings and visits
    const filteredBookings = state.bookings.filter(b => {
      const date = new Date(b.startDateISO);
      return date.getFullYear() === filterYear;
    });
    
    // Create a shallow copy of state with filtered lists
    const filteredState = {
      ...state,
      bookings: filteredBookings,
      visits: state.visits.filter(v => {
        const date = new Date(v.startDateISO);
        return date.getFullYear() === filterYear;
      }),
      // Recalculate stats for the filtered response
      stats: {
        ...state.stats,
        totalBookings: filteredBookings.length
      }
    };
    return res.json(filteredState);
  }
  
  res.json(state);
});

app.post('/reset', (req, res) => {
    state.bookings = JSON.parse(JSON.stringify(seedReservations));
    state.badges = [];
    broadcastState();
    res.json({ message: 'Reset complete', state });
});

// 1. Create Reservation
app.post('/actions/reservation', (req, res) => {
    const reservation = createReservation(req.body);
    broadcastState();
    res.json({ message: 'Reservation created', reservation });
});

// 2. Create Visit
app.post('/actions/visit', (req, res) => {
    const visit = createVisit(req.body);
    broadcastState();
    res.json({ message: 'Visit created', visit });
});

// 3. Smart Badge Completion
app.post('/actions/complete-badge', (req, res) => {
    const { badgeId } = req.body;
    let generatedCount = 0;

    const today = new Date();
    
    switch (badgeId) {
        case 'early-riser': // 5 check-ins before 8 AM
            for (let i = 1; i <= 5; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                date.setHours(7, 0, 0, 0); // 7:00 AM
                
                state.bookings.unshift({
                    _id: `auto-early-${i}`,
                    reserverId: 'user-123',
                    locationId: 'loc-nyc-flatiron',
                    startDateISO: date.toISOString(),
                    endDateISO: new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                    localStartDate: date.toISOString().split('T')[0],
                    timezone: 'America/New_York',
                    price: 45,
                    checkInStatus: 'Checked In',
                    status: 'Confirmed'
                });
                generatedCount++;
            }
            break;

        case 'world-traveler': // 5 different cities
            const cities = [
                { id: 'loc-lon', timezone: 'Europe/London' },
                { id: 'loc-par', timezone: 'Europe/Paris' },
                { id: 'loc-tok', timezone: 'Asia/Tokyo' },
                { id: 'loc-syn', timezone: 'Australia/Sydney' },
                { id: 'loc-ber', timezone: 'Europe/Berlin' }
            ];
            
            cities.forEach((city, index) => {
                 const date = new Date(today);
                 date.setDate(today.getDate() - (index + 1) * 7); // Spread out weekly
                 
                 state.bookings.unshift({
                    _id: `auto-travel-${index}`,
                    reserverId: 'user-123',
                    locationId: city.id,
                    startDateISO: date.toISOString(),
                    endDateISO: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(),
                    localStartDate: date.toISOString().split('T')[0],
                    timezone: city.timezone,
                    price: 45,
                    checkInStatus: 'Checked In',
                    status: 'Confirmed'
                });
                generatedCount++;
            });
            break;
            
        case 'anchor': // 10 bookings in same room
             for (let i = 1; i <= 10; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                
                state.bookings.push({ // Push to end to avoid cluttering top
                    _id: `auto-anchor-${i}`,
                    reserverId: 'user-123',
                    locationId: 'loc-nyc-flatiron',
                    meetingRoomId: 'room-favorite-1', // Same room ID
                    title: 'Daily Standup',
                    startDateISO: date.toISOString(),
                    endDateISO: new Date(date.getTime() + 1 * 60 * 60 * 1000).toISOString(),
                    localStartDate: date.toISOString().split('T')[0],
                    timezone: 'America/New_York',
                    price: 75,
                    status: 'Confirmed'
                });
                generatedCount++;
             }
             break;
             
        // Fallback: Just unlock it in badges array directly if logic is too complex to simulate
        default:
            state.badges.push({ badgeId, earnedAt: new Date().toISOString() });
            break;
    }

    broadcastState();
    res.json({ message: `Simulated data for badge: ${badgeId}`, generatedItems: generatedCount });
});


// --- Server ---

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Demo backend running on http://localhost:${PORT}`);
});
