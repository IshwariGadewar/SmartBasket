#!/bin/bash

echo "🚀 Setting up SmartCart AI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please configure your .env file with your MongoDB URI and OpenAI API key"
fi

cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install

# Create TailwindCSS config if it doesn't exist
if [ ! -f tailwind.config.js ]; then
    echo "📝 Creating TailwindCSS configuration..."
    echo "module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      }
    }
  },
  plugins: []
}" > tailwind.config.js
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your .env file in the server directory"
echo "2. Set up MongoDB Atlas and get your connection string"
echo "3. Get an OpenAI API key from https://platform.openai.com"
echo "4. Update the MONGODB_URI and OPENAI_API_KEY in server/.env"
echo ""
echo "🚀 To start the application:"
echo "1. Start the server: cd server && npm run dev"
echo "2. Start the client: cd client && npm start"
echo ""
echo "🌐 Access the application at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo ""
echo "📚 For more information, see the README.md file" 