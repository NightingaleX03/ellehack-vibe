# CityBuddy AI - Hackathon MVP 🏙️

A React Native app built with TypeScript that helps newcomers navigate their city with AI-powered recommendations.

## ✨ Features

- 🎯 **Onboarding & User Profile** - Quick setup for personalized experience (user type, interests, budget, roommate preferences)
- 🗺️ **Explore My Area** - Browse recommendations by category (food, nightlife, parks, events, shopping, culture)
- 🆘 **Emergency Help** - Quick access to hospitals, clinics, and police stations with AI-generated data
- 🍽️ **Food & Groceries** - Find nearby restaurants and grocery stores
- 🎉 **Things to Do** - Discover local events and activities
- 🏠 **Roommate Finder** - AI-powered roommate matching with compatibility scores and agreement generation
- 🤖 **Talk to Gemini** - Chat with AI for city guidance and recommendations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- React Native CLI installed globally: `npm install -g react-native-cli`
- Android Studio (for Android) or Xcode (for iOS)

### Installation

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
   - Sign in with your Google account
   - Create a new API key
   - Copy it to your `.env` file

3. **Run the app:**
   ```bash
   # Start Metro bundler
   npm start
   
   # In a new terminal, run:
   npm run android  # for Android
   # or
   npm run ios      # for iOS
   ```

## 📁 Project Structure

```
src/
├── screens/          # All app screens
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ExploreScreen.tsx
│   ├── RecommendationsScreen.tsx
│   ├── EmergencyScreen.tsx
│   ├── RoommatesScreen.tsx
│   └── ChatScreen.tsx
├── navigation/       # Navigation setup
│   ├── AppNavigator.tsx
│   └── types.ts
├── services/         # API services
│   └── gemini.ts     # Gemini AI integration
├── utils/            # Utility functions
│   └── storage.ts    # AsyncStorage helpers
├── types/            # TypeScript type definitions
│   ├── index.ts
│   └── env.d.ts
├── data/             # Hardcoded data
│   └── roommates.ts  # Sample roommate profiles
└── config/           # Configuration
    └── env.ts        # Environment variable helpers
```

## 🛠️ Tech Stack

- **React Native 0.73** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design UI components
- **Google Gemini AI** - AI-powered recommendations and chat
- **AsyncStorage** - Local data persistence
- **react-native-dotenv** - Environment variable management

## 📱 Features Breakdown

### Onboarding Flow
- User type selection (student/newcomer/tourist/worker)
- Interest selection (food, nightlife, parks, events, shopping, culture)
- Budget preference (low/medium/high)
- Optional roommate preferences

### AI Recommendations
- Category-based recommendations (food, nightlife, parks, events)
- Personalized based on user profile
- Distance and address information
- Refresh functionality

### Roommate Finder
- 8 hardcoded sample roommate profiles
- AI-powered compatibility scoring
- Generate roommate agreement (one paragraph summary)
- Filter by budget, location, pets, schedule

### Emergency Help
- AI-generated list of emergency services
- Hospitals, clinics, and police stations
- Distance and contact information
- Color-coded by service type

### AI Chat
- Conversational interface with Gemini
- Context-aware responses based on user profile
- Real-time chat experience

## 🔒 Security Notes

- The `.env` file is already in `.gitignore` to protect your API key
- Never commit your `.env` file to version control
- The app includes fallback mock data if the API key is missing

## 📝 Development Notes

- All user data is stored locally using AsyncStorage
- The app works offline with mock data if Gemini API is unavailable
- Mock data is provided as fallback for all AI features
- No backend required - everything runs client-side

## 🐛 Troubleshooting

**Metro bundler issues:**
```bash
npm start -- --reset-cache
```

**Environment variables not loading:**
- Make sure `.env` file is in the root directory
- Restart Metro bundler after creating/updating `.env`
- Check that `react-native-dotenv` is installed

**API not working:**
- Verify your Gemini API key is correct
- Check that the key has proper permissions
- The app will use mock data if API fails

## 📄 License

This project was created for a hackathon MVP. Feel free to use and modify as needed.

