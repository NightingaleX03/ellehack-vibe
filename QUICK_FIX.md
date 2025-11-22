# Quick Fix Guide - "No Recommendations" Issue

## ✅ Your API Keys (Confirmed)
- **Gemini API Key**: `AIzaSyDrdnzHtRrZou5hB_sTy4TXq1_9E5tAOsc` ✅
- **Google Maps API Key**: `AIzaSyCKvbKPMs9sUqNnHt_7Dy7FUi4JB7dy-kY` ✅

## 🔍 Debugging Steps

### 1. Check Browser Console (F12)
Open your browser's developer console and look for:
- `✅ Gemini API key loaded` - Should show if Gemini key is working
- `✅ Google Maps API key loaded` - Should show if Maps key is working
- `Getting recommendations:` - Shows what's being requested
- `Geocoding API response:` - Shows if Geocoding API is working
- `Places API response:` - Shows if Places API is working

### 2. Common Error Messages

#### "REQUEST_DENIED"
**Meaning**: API not enabled or API key restrictions
**Fix**: 
1. Go to Google Cloud Console
2. APIs & Services > Credentials
3. Click your API key
4. Under "API restrictions", make sure these are checked:
   - ✅ Geocoding API
   - ✅ Places API
5. Under "Application restrictions", add:
   - `http://localhost:8120/*`
   - `http://localhost:3000/*`

#### "OVER_QUERY_LIMIT"
**Meaning**: You've exceeded the free tier
**Fix**: Check usage in Google Cloud Console > APIs & Services > Dashboard

#### "ZERO_RESULTS"
**Meaning**: No places found (might be normal for some categories)
**Fix**: Try a different category or postal code

### 3. Verify APIs Are Enabled

In Google Cloud Console:
1. Go to "APIs & Services" > "Library"
2. Search for each API and verify it shows "Enabled":
   - ✅ **Geocoding API** - Must be enabled
   - ✅ **Places API** - Must be enabled

### 4. Test API Directly

Test your API key in browser:
```
https://maps.googleapis.com/maps/api/geocode/json?address=M5H%202N2&key=AIzaSyCKvbKPMs9sUqNnHt_7Dy7FUi4JB7dy-kY
```

Should return JSON with `"status": "OK"`

### 5. Restart Dev Server

After enabling APIs:
1. Stop webpack (Ctrl+C)
2. Clear browser cache (Ctrl+Shift+R)
3. Restart: `npm run web:dev`

## 🚀 What Should Work Now

Even if Google Maps APIs aren't fully set up, **Gemini AI should still work** and generate recommendations based on your location!

Check the browser console to see which APIs are working.

