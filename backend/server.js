const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const packageRoutes = require('./routes/packageRoutes');
const postRoutes = require('./routes/postRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
// Access via: http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Links
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'LuxeDiscovery API is running 🚀' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('Database connection error:', err));

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server executing safely on port ${PORT}`));