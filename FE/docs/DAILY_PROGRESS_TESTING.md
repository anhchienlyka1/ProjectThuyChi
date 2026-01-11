# Test Daily Progress API

## 1. Check if backend is running

```bash
curl http://localhost:3000/learning/daily-completions?userId=demo-user-id
```

Expected response:

```json
{
  "date": "2026-01-11",
  "completions": {
    "subtraction": 1,
    "addition": 2
  }
}
```

## 2. Complete a session first

```bash
curl -X POST http://localhost:3000/learning/complete \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo-user-id",
    "levelId": "subtraction",
    "score": 8,
    "totalQuestions": 10,
    "durationSeconds": 120
  }'
```

## 3. Check completions again

```bash
curl http://localhost:3000/learning/daily-completions?userId=demo-user-id
```

Should now show subtraction count increased.

## 4. Check browser console

Open DevTools → Console and look for:

- ✅ "Failed to load daily completions" - means API call failed
- ✅ Network tab → XHR → Check if `/learning/daily-completions` is called
- ✅ Check response data

## 5. Common Issues

### Issue 1: CORS Error

**Symptom**: Console shows CORS error
**Fix**: Check backend CORS configuration

### Issue 2: 404 Not Found

**Symptom**: API returns 404
**Fix**: Backend not running or route not registered

### Issue 3: Empty completions

**Symptom**: API returns `{ completions: {} }`
**Fix**: No sessions completed today, or wrong userId

### Issue 4: Cache not updating

**Symptom**: Badges don't appear after completing
**Fix**: Component needs to call `refreshCompletions()` on init

## 6. Debug Steps

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter: XHR
4. Complete a lesson
5. Navigate back to modules page
6. Check if you see:
   - `POST /learning/complete` (status 200)
   - `GET /learning/daily-completions` (status 200)
7. Click on the GET request
8. Check Response tab - should show completions object

## 7. Force Refresh

In browser console, run:

```javascript
// Get the service
const service = window['ng'].getInjector().get('DailyProgressService');
// Force refresh
service.refreshCompletions().subscribe(data => console.log(data));
```
