# Google Maps API Setup Guide

This app requires **2 Google Maps APIs** to be enabled in your Google Cloud Console.

## Required APIs

1. **Geocoding API** - Converts postal codes to coordinates
2. **Places API (Text Search)** - Finds nearby places, restaurants, hospitals, etc.

## Step-by-Step Setup

### 1. Go to Google Cloud Console

Visit: https://console.cloud.google.com/

### 2. Create or Select a Project

- If you don't have a project, click "Create Project"
- Give it a name (e.g., "CityBuddy AI")
- Click "Create"

### 3. Enable Billing (Required)

⚠️ **Note**: Google Maps APIs require a billing account, BUT:
- Google gives you **$200 free credit per month**
- Most small apps stay within the free tier
- Geocoding: **$5 per 1,000 requests**
- Places Text Search: **$32 per 1,000 requests**

**To enable billing:**
1. Go to "Billing" in the left menu
2. Click "Link a billing account"
3. Follow the prompts to add a payment method
4. Don't worry - you'll get $200 free credit monthly

### 4. Enable the Required APIs

#### Enable Geocoding API:
1. Go to "APIs & Services" > "Library"
2. Search for "Geocoding API"
3. Click on it
4. Click "Enable"

#### Enable Places API:
1. In "APIs & Services" > "Library"
2. Search for "Places API"
3. Click on it
4. Click "Enable"
5. **Important**: Make sure you enable "Places API" (not "Places API (New)")

### 5. Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key (it will look like: `AIzaSy...`)

### 6. Restrict Your API Key (Recommended for Security)

1. Click on your newly created API key
2. Under "API restrictions":
   - Select "Restrict key"
   - Check ONLY:
     - ✅ Geocoding API
     - ✅ Places API
3. Under "Application restrictions":
   - For web: Select "HTTP referrers"
   - Add: `http://localhost:3000/*` (for development)
   - Add: `http://localhost:8120/*` (if using port 8120)
   - Add your production domain when ready
4. Click "Save"

### 7. Add API Key to Your App

Your API key is already in the `.env` file:
```
GOOGLE_MAPS_API_KEY=AIzaSyDrdnzHtRrZou5hB_sTy4TXq1_9E5tAOsc
```

**If you created a new API key**, update the `.env` file:
```
GOOGLE_MAPS_API_KEY=YOUR_NEW_API_KEY_HERE
```

### 8. Verify It's Working

1. Restart your webpack dev server:
   ```bash
   npm run web:dev
   ```

2. Open the app in your browser
3. Complete onboarding with a postal code (e.g., "M5H 2N2")
4. Navigate to "Food & Groceries" or any category
5. You should see real places from Google Maps!

## Troubleshooting

### Error: "This API project is not authorized to use this API"
- **Solution**: Make sure you've enabled both Geocoding API and Places API in step 4

### Error: "REQUEST_DENIED" or "API key not valid"
- **Solution**: 
  - Check that your API key is correct in `.env`
  - Make sure billing is enabled
  - Verify the API key restrictions allow the APIs you need

### Error: "OVER_QUERY_LIMIT"
- **Solution**: You've exceeded the free tier. Check your usage in Google Cloud Console > APIs & Services > Dashboard

### No places showing up
- **Solution**: 
  - Check browser console for errors
  - Verify API key is in `.env` file
  - Make sure both APIs are enabled
  - Check that your postal code is valid (try "M5H 2N2" for Toronto)

## Cost Management

To avoid unexpected charges:

1. **Set up billing alerts**:
   - Go to "Billing" > "Budgets & alerts"
   - Create a budget (e.g., $10/month)
   - Set up email alerts

2. **Monitor usage**:
   - Go to "APIs & Services" > "Dashboard"
   - Check your daily API usage

3. **Set API quotas** (optional):
   - Go to "APIs & Services" > "Quotas"
   - Set daily limits for each API

## Free Tier Limits

With $200 free credit per month, you can make approximately:
- **Geocoding**: ~40,000 requests/month (free)
- **Places Text Search**: ~6,250 requests/month (free)

For a hackathon/demo, this is more than enough!

## Need Help?

- Google Maps API Documentation: https://developers.google.com/maps/documentation
- Places API Guide: https://developers.google.com/maps/documentation/places/web-service
- Geocoding API Guide: https://developers.google.com/maps/documentation/geocoding

