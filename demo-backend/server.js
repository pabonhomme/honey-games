const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for Vercel domains and local development
const io = new Server(server, {
  cors: {
    origin: '*', // For demo purposes, allow all. In prod, restrict to specific Vercel domains.
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Mock Data
const mockUser = {
  _id: 'user-123',
  firstName: 'Jordan',
  lastName: 'Member',
  email: 'jordan@example.com',
  profilePictureUrl: 'https://avatar.vercel.sh/jordan',
  memberSinceISO: '2023-01-15T00:00:00.000Z',
  accounts: [
    { _id: 'acc-1', name: 'Acme Corp' }
  ],
  membershipType: 'member',
  primaryLocation: 'Flatiron'
};

const mockReservations = [
  {
    _id: 'res-1',
    reserverId: 'user-123',
    locationId: 'loc-nyc-flatiron',
    startDateISO: new Date(new Date().setHours(9)).toISOString(),
    endDateISO: new Date(new Date().setHours(17)).toISOString(),
    localStartDate: new Date().toISOString().split('T')[0],
    localEndDate: new Date().toISOString().split('T')[0],
    timezone: 'America/New_York',
    price: 45,
    status: 'Confirmed',
    checkInStatus: 'Checked In',
    source: 'MemberPortal',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'res-2',
    reserverId: 'user-123',
    locationId: 'loc-nyc-flatiron',
    startDateISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    endDateISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    localStartDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    localEndDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timezone: 'America/New_York',
    price: 45,
    status: 'Confirmed',
    checkInStatus: 'Checked In',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'res-3',
    reserverId: 'user-123',
    locationId: 'loc-nyc-flatiron',
    meetingRoomId: 'room-abc',
    title: 'Client Strategy',
    startDateISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDateISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    localStartDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    localEndDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timezone: 'America/New_York',
    price: 75,
    status: 'Confirmed',
    nbAttendees: 4,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
      _id: 'res-4',
      reserverId: 'user-123',
      locationId: 'loc-sf-soma',
      startDateISO: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDateISO: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      localStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      localEndDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timezone: 'America/Los_Angeles',
      price: 45,
      status: 'Confirmed',
      checkInStatus: 'Checked In',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Helper to split generic reservations into bookings (future/meeting rooms) vs visits (past check-ins) for simulation structure
// For simplicity in this demo, let's just put all in 'bookings' or 'visits' based on check-in status, 
// or keep a specific logical separation. frontend just creates one list.
// The frontend merges bookings and visits.

let state = {
  users: { 'user-123': mockUser },
  bookings: mockReservations, // Using one list for simplicity as frontend merges them
  visits: [], // Can use this for live check-ins simulation
  badges: [],
  stats: {
    totalBookings: mockReservations.length,
    activeUsers: 0
  },
  leaderboard: []
};

// Initial empty state (deep copy helper - WITH SEED DATA)
const getInitialState = () => ({
  users: { 'user-123': mockUser },
  bookings: JSON.parse(JSON.stringify(mockReservations)),
  visits: [],
  badges: [],
  stats: {
    totalBookings: mockReservations.length,
    activeUsers: 0
  },
  leaderboard: []
});

// Helper to broadcast state
const broadcastState = () => {
    io.emit('state:update', state);
};

// --- REST Endpoints ---

// Get full state
app.get('/state', (req, res) => {
  res.json(state);
});

// Reset state
app.post('/reset', (req, res) => {
  state = getInitialState();
  broadcastState();
  res.json({ message: 'State reset', state });
});

// Simulate Booking
app.post('/simulate/booking', (req, res) => {
  const booking = req.body;
  
  // Add booking to list
  state.bookings.unshift({
    id: Date.now().toString(),
    ...booking,
    timestamp: new Date().toISOString()
  });

  // Update stats
  state.stats.totalBookings += 1;

  // Emit events
  io.emit('booking:update', booking);
  broadcastState();

  res.json({ message: 'Booking simulated', booking });
});

// Simulate Visit
app.post('/simulate/visit', (req, res) => {
    const visit = req.body;
    
    state.visits.unshift({
        id: Date.now().toString(),
        ...visit,
        timestamp: new Date().toISOString()
    });

    io.emit('visit:update', visit);
    broadcastState();

    res.json({ message: 'Visit simulated', visit });
});

// Simulate Badge
app.post('/simulate/badge', (req, res) => {
    const badge = req.body;
    
    // Add or update badge logic could go here, for now just pushing to a list
    state.badges.unshift({
        id: Date.now().toString(),
        ...badge,
        timestamp: new Date().toISOString()
    });

    io.emit('badge:update', badge);
    broadcastState();

    res.json({ message: 'Badge unique unlocked/updated', badge });
});


// --- WebSocket Connection ---

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  state.stats.activeUsers += 1;
  broadcastState();

  // Send current state to new client immediately
  socket.emit('state:update', state);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    state.stats.activeUsers = Math.max(0, state.stats.activeUsers - 1);
    broadcastState();
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Demo backend running on http://localhost:${PORT}`);
  console.log(`Socket.IO enabled`);
});
