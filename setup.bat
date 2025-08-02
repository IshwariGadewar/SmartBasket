@echo off
echo 🚀 Setting up SmartCart AI...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
call npm install

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ⚠️  Please configure your .env file with your MongoDB URI and OpenAI API key
)

cd ..

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
call npm install

REM Create TailwindCSS config if it doesn't exist
if not exist tailwind.config.js (
    echo 📝 Creating TailwindCSS configuration...
    echo module.exports = { > tailwind.config.js
    echo   content: ['./src/**/*.{js,jsx,ts,tsx}'], >> tailwind.config.js
    echo   theme: { >> tailwind.config.js
    echo     extend: { >> tailwind.config.js
    echo       colors: { >> tailwind.config.js
    echo         primary: { >> tailwind.config.js
    echo           50: '#eff6ff', >> tailwind.config.js
    echo           100: '#dbeafe', >> tailwind.config.js
    echo           200: '#bfdbfe', >> tailwind.config.js
    echo           300: '#93c5fd', >> tailwind.config.js
    echo           400: '#60a5fa', >> tailwind.config.js
    echo           500: '#3b82f6', >> tailwind.config.js
    echo           600: '#2563eb', >> tailwind.config.js
    echo           700: '#1d4ed8', >> tailwind.config.js
    echo           800: '#1e40af', >> tailwind.config.js
    echo           900: '#1e3a8a', >> tailwind.config.js
    echo         } >> tailwind.config.js
    echo       } >> tailwind.config.js
    echo     } >> tailwind.config.js
    echo   }, >> tailwind.config.js
    echo   plugins: [] >> tailwind.config.js
    echo } >> tailwind.config.js
)

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Configure your .env file in the server directory
echo 2. Set up MongoDB Atlas and get your connection string
echo 3. Get an OpenAI API key from https://platform.openai.com
echo 4. Update the MONGODB_URI and OPENAI_API_KEY in server/.env
echo.
echo 🚀 To start the application:
echo 1. Start the server: cd server ^&^& npm run dev
echo 2. Start the client: cd client ^&^& npm start
echo.
echo 🌐 Access the application at:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo.
echo 📚 For more information, see the README.md file
pause 