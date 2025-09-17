#!/bin/bash

# Paper Stream iOS Testing Setup Script

echo "🚀 Setting up Paper Stream for iOS testing..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if HTTPS is available (required for PWA)
echo "🔒 Checking HTTPS requirement..."
echo "Note: PWA features require HTTPS. For local testing, you may need:"
echo "1. Use ngrok: npx ngrok http 3000"
echo "2. Use a local HTTPS server"
echo "3. Test on a device with HTTPS enabled"

# Start the development server
echo "🌐 Starting development server..."
echo "The app will be available at: http://localhost:3000"
echo ""
echo "📱 iOS Testing Instructions:"
echo "1. Open Safari on your iOS device"
echo "2. Navigate to your server's HTTPS URL"
echo "3. Tap the share button and 'Add to Home Screen'"
echo "4. Test the installed PWA"
echo ""
echo "🔍 Testing Checklist:"
echo "- [ ] App loads correctly"
echo "- [ ] Can add to home screen"
echo "- [ ] Works in standalone mode"
echo "- [ ] Touch interactions feel responsive"
echo "- [ ] Safe area handling works"
echo "- [ ] Keyboard doesn't break layout"
echo ""

# Start the server
npm start