# Troubleshooting Guide

## "No Recommendations Found" Issue

If you're seeing "No recommendations found", follow these steps:

### 1. Check API Keys are Loaded

Open browser console (F12) and check for:
- `Getting recommendations:` log with API key status
- Any error messages about missing API keys

### 2. Verify .env File

Make sure your `.env` file contains:
```
GEMINI_API_KEY=AIzaSyDrdnzHtRrZou5hB_sTy4TXq1_9E5tAOsc
GOOGLE_MAPS_API_KEY=AIzaSyCKvbKPMs9sUqNnHt_7Dy7FUi4JB7dy-kY
```

### 3. Enable Google Maps APIs

**CRITICAL**: You must enable these APIs in Google Cloud Console:

1. Go to: https://console.cloud.google.com/
2. Select your project (or create one)
3. Enable billing (required, but $200/month free credit)
4. Enable these APIs:
   - **Geocoding API** (for postal code → coordinates)
   - **Places API** (for finding nearby places)

See `GOOGLE_MAPS_SETUP.md` for detailed instructions.

### 4. Check API Key Restrictions

In Google Cloud Console:
- Go to "APIs & Services" > "Credentials"
- Click on your API key
- Under "API restrictions", make sure these are enabled:
  - ✅ Geocoding API
  - ✅ Places API
  - ✅ Maps Embed API (for map display)

### 5. Restart Dev Server

After enabling APIs:
1. Stop webpack dev server (Ctrl+C)
2. Restart: `npm run web:dev`
3. Clear browser cache (Ctrl+Shift+R)

### 6. Check Browser Console

Open browser console (F12) and look for:
- API errors (REQUEST_DENIED, OVER_QUERY_LIMIT, etc.)
- Network errors
- JavaScript errors

### Common Errors

#### "REQUEST_DENIED"
- **Cause**: API not enabled or API key restrictions
- **Fix**: Enable Geocoding API and Places API in Google Cloud Console

#### "OVER_QUERY_LIMIT"
- **Cause**: Exceeded free tier limits
- **Fix**: Check usage in Google Cloud Console, wait for quota reset

#### "API key not valid"
- **Cause**: Wrong API key or key restrictions
- **Fix**: Verify API key in `.env` matches Google Cloud Console

#### "No API keys available"
- **Cause**: `.env` file not loaded or keys not set
- **Fix**: Check `.env` file exists and has correct keys, restart dev server

### 7. Test API Keys Directly

Test Geocoding API:
```
https://maps.googleapis.com/maps/api/geocode/json?address=M5H%202N2&key=YOUR_API_KEY
```

Test Places API:
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants%20near%20M5H%202N2&key=YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your actual key from `.env`.

### 8. Verify Postal Code

Make sure you've:
1. Completed onboarding
2. Entered a valid postal code (e.g., "M5H 2N2" for Toronto)
3. Saved your profile

### Still Not Working?

1. Check browser console for detailed error messages
2. Verify API keys in Google Cloud Console match `.env` file
3. Make sure billing is enabled (required for Google Maps APIs)
4. Check API quotas haven't been exceeded
5. Try a different postal code to test

