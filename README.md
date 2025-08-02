# SmartCart AI 🛒

A full-stack MERN application that allows users to compare product prices across multiple e-commerce platforms like Amazon, Blinkit, Zepto, and Instamart. Powered by AI for intelligent product matching and smart price alerts.

## ✨ Features

### 🔍 Smart Product Search
- Search by product name or paste product URLs
- AI-powered product matching across platforms
- Automatic pincode-based platform availability filtering
- Real-time search suggestions

### 💰 Price Comparison
- Compare prices across Amazon, Blinkit, Zepto, and Instamart
- View delivery charges and delivery times
- AI-generated price analysis and recommendations
- Best value recommendations

### 🔔 Smart Alerts
- Set price drop alerts for products
- Get notified when prices reach target
- Multiple alert types (price drop, increase, stock availability)
- Email and push notifications

### 👤 User Features
- User registration and authentication
- Save favorite products
- Track search history
- Pro tier with advanced features
- Profile management

### 🤖 AI-Powered Features
- OpenAI integration for product matching
- Natural language processing for search queries
- Intelligent price trend analysis
- Smart product recommendations

### 📊 Admin Dashboard
- User analytics and management
- Search trend analysis
- Platform performance metrics
- System health monitoring

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **Puppeteer** - Web scraping
- **OpenAI API** - AI/ML capabilities
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Heroicons** - Icon library
- **React Query** - Data fetching
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **Recharts** - Data visualization

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartcart
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cd ../server
   cp env.example .env
   ```

4. **Configure Environment Variables**
   Edit `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartcart-ai?retryWrites=true&w=majority
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # OpenAI API Configuration
   OPENAI_API_KEY=your-openai-api-key-here
   
   # Email Configuration (for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

5. **Start the application**
   ```bash
   # Start server (from server directory)
   npm run dev

   # Start client (from client directory)
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
smartcart/
├── server/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   ├── server.js         # Express server
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── App.jsx       # Main app component
│   │   └── index.js      # Entry point
│   ├── public/           # Static files
│   └── package.json
└── README.md
```

## 🔧 Configuration

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to `MONGODB_URI` in `.env`

### OpenAI API Setup
1. Create an OpenAI account
2. Generate an API key
3. Add it to `OPENAI_API_KEY` in `.env`

### Email Notifications (Optional)
1. Set up SMTP credentials
2. Configure email settings in `.env`

## 🎯 Usage

### For Users
1. **Register/Login** - Create an account or sign in
2. **Set Location** - Enter your pincode for accurate results
3. **Search Products** - Search by name or paste product URLs
4. **Compare Prices** - View prices across all available platforms
5. **Save Products** - Bookmark products for later
6. **Set Alerts** - Get notified when prices drop

### For Admins
1. **Access Dashboard** - Navigate to `/admin`
2. **View Analytics** - Monitor user activity and search trends
3. **Manage Users** - View and manage user accounts
4. **Track Performance** - Monitor platform performance metrics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## 🤖 AI Features

### Product Matching
- Uses OpenAI GPT-3.5-turbo for intelligent product matching
- Compares product names, quantities, and descriptions
- Handles different packaging and brand variations

### Search Enhancement
- Natural language processing for search queries
- Automatic product information extraction
- Smart search suggestions

### Price Analysis
- AI-generated price insights
- Best value recommendations
- Price trend analysis

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Search & Products
- `POST /api/search` - Search products
- `GET /api/suggestions` - Get search suggestions
- `GET /api/pincode/:pincode/availability` - Check platform availability

### User Features
- `POST /api/save-product` - Save product
- `DELETE /api/save-product/:id` - Remove saved product
- `GET /api/saved-products` - Get saved products
- `POST /api/alert` - Create price alert
- `GET /api/alerts` - Get user alerts
- `DELETE /api/alert/:id` - Delete alert

### Chatbot
- `POST /api/chatbot` - Chat with AI assistant

### Admin (Protected)
- `GET /admin/analytics` - Get analytics data
- `GET /admin/users` - Get user management data
- `GET /admin/products` - Get product analytics
- `GET /admin/alerts` - Get alert analytics
- `GET /admin/search-trends` - Get search trends
- `GET /admin/platform-performance` - Get platform performance
- `GET /admin/health` - System health check

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Add MongoDB Atlas addon
heroku addons:create mongolab

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set OPENAI_API_KEY=your-key

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- MongoDB Atlas for database hosting
- TailwindCSS for styling
- React community for amazing tools

## 📞 Support

For support, email support@smartcart.ai or create an issue in this repository.

---

**SmartCart AI** - Making online shopping smarter with AI! 🛒✨
