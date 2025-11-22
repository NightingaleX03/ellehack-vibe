# CityBuddy AI - Setup Instructions

## Prerequisites

- Node.js 18+ installed
- React Native development environment set up
- Android Studio (for Android) or Xcode (for iOS)

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   To get a Gemini API key:
   - Go to https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy it to your `.env` file

3. **Run the app:**
   
   For Android:
   ```bash
   npm run android
   ```
   
   For iOS:
   ```bash
   npm run ios
   ```

## Project Structure

```
src/
├── screens/          # All app screens
├── navigation/       # Navigation setup
├── services/         # API services (Gemini)
├── utils/            # Utility functions (storage)
├── types/            # TypeScript type definitions
├── data/             # Hardcoded data (roommates)
└── config/           # Configuration files
```

## Features

- ✅ Onboarding & User Profile
- ✅ Home Screen with navigation
- ✅ AI Chat with Gemini
- ✅ Local Recommendations
- ✅ Emergency Help
- ✅ Roommate Finder
- ✅ Explore by Category

## Notes

- All data is stored locally using AsyncStorage
- The app works offline with mock data if Gemini API is unavailable
- Make sure your `.env` file is in `.gitignore` (already configured)

