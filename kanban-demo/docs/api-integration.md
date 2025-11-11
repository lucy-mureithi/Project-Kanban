# 🔌 Google Sheets API Integration Guide

> Phase 2 Implementation - Connect FitOps to Google Sheets

## Overview

This guide covers the complete setup for integrating FitOps with Google Sheets, enabling real-time member data synchronization.

---

## 1. Google Sheets Setup

### Create Your Sheets Structure

#### Sheet 1: Members
```
| MemberID | Name | Email | Phone | JoinDate | Status | MembershipType | LastCheckIn | CheckInCount | RenewalDate |
|----------|------|-------|-------|----------|--------|----------------|-------------|--------------|-------------|
```

**Example Data:**
```
member-1 | Sarah Johnson | sarah.j@email.com | +1-555-0123 | 2024-11-01 | pending-activation | Premium | | 0 | 2025-11-01
member-2 | Emily Rodriguez | emily.r@email.com | +1-555-0125 | 2024-09-15 | active | Premium | 2024-11-03 | 36 | 2024-12-15
```

#### Sheet 2: CheckIns
```
| CheckInID | MemberID | Date | Time | Location |
|-----------|----------|------|------|----------|
```

#### Sheet 3: Memberships
```
| MembershipID | Type | Price | Duration | Features |
|--------------|------|-------|----------|----------|
```

### Template Spreadsheet

**Access the template:** [Create from scratch or copy this structure]

---

## 2. Google Apps Script Backend

### Setup Steps

1. **Open Your Sheet** → Extensions → Apps Script
2. **Create New Project** → Name it "FitOps API"
3. **Copy the code below**

### Code.gs

```javascript
/**
 * FitOps Google Apps Script Backend
 * Provides REST API for member data
 */

const SHEET_ID = 'YOUR_SHEET_ID_HERE';
const API_KEY = 'YOUR_SECRET_API_KEY'; // Change this!

// CORS and API Key verification
function doGet(e) {
  try {
    // Verify API key
    if (e.parameter.key !== API_KEY) {
      return jsonResponse({ error: 'Invalid API key' }, 401);
    }

    const action = e.parameter.action;
    
    switch(action) {
      case 'getMembers':
        return getMembers();
      case 'getMember':
        return getMember(e.parameter.id);
      case 'getStats':
        return getStats();
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function doPost(e) {
  try {
    // Verify API key
    const data = JSON.parse(e.postData.contents);
    if (data.key !== API_KEY) {
      return jsonResponse({ error: 'Invalid API key' }, 401);
    }

    const action = data.action;
    
    switch(action) {
      case 'addMember':
        return addMember(data.member);
      case 'updateMember':
        return updateMember(data.id, data.updates);
      case 'recordCheckIn':
        return recordCheckIn(data.memberId);
      case 'deleteMember':
        return deleteMember(data.id);
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

// Get all members
function getMembers() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Members');
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  const members = data.slice(1).map(row => ({
    id: row[0],
    title: row[1],
    email: row[2],
    phone: row[3],
    joinDate: row[4],
    status: row[5],
    membershipType: row[6],
    lastCheckIn: row[7] || null,
    checkInCount: row[8] || 0,
    renewalDate: row[9] || null,
    description: row[10] || '',
    labels: row[11] ? row[11].split(',') : []
  }));
  
  return jsonResponse({ members });
}

// Get single member
function getMember(id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Members');
  const data = sheet.getDataRange().getValues();
  
  const row = data.find(r => r[0] === id);
  if (!row) {
    return jsonResponse({ error: 'Member not found' }, 404);
  }
  
  const member = {
    id: row[0],
    title: row[1],
    email: row[2],
    phone: row[3],
    joinDate: row[4],
    status: row[5],
    membershipType: row[6],
    lastCheckIn: row[7] || null,
    checkInCount: row[8] || 0,
    renewalDate: row[9] || null,
    description: row[10] || '',
    labels: row[11] ? row[11].split(',') : []
  };
  
  return jsonResponse({ member });
}

// Add new member
function addMember(member) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Members');
  
  const newRow = [
    member.id || `member-${Date.now()}`,
    member.title,
    member.email || '',
    member.phone || '',
    member.joinDate || new Date().toISOString().split('T')[0],
    member.status || 'registration',
    member.membershipType || 'Basic',
    member.lastCheckIn || '',
    member.checkInCount || 0,
    member.renewalDate || '',
    member.description || '',
    member.labels ? member.labels.join(',') : ''
  ];
  
  sheet.appendRow(newRow);
  
  return jsonResponse({ success: true, id: newRow[0] });
}

// Update member
function updateMember(id, updates) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Members');
  const data = sheet.getDataRange().getValues();
  
  const rowIndex = data.findIndex(r => r[0] === id);
  if (rowIndex === -1) {
    return jsonResponse({ error: 'Member not found' }, 404);
  }
  
  // Update fields (add 1 for 1-indexed sheets)
  if (updates.title) sheet.getRange(rowIndex + 1, 2).setValue(updates.title);
  if (updates.email) sheet.getRange(rowIndex + 1, 3).setValue(updates.email);
  if (updates.status) sheet.getRange(rowIndex + 1, 6).setValue(updates.status);
  if (updates.description) sheet.getRange(rowIndex + 1, 11).setValue(updates.description);
  
  return jsonResponse({ success: true });
}

// Record check-in
function recordCheckIn(memberId) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const membersSheet = ss.getSheetByName('Members');
  const checkInsSheet = ss.getSheetByName('CheckIns');
  
  // Update member's last check-in and count
  const data = membersSheet.getDataRange().getValues();
  const rowIndex = data.findIndex(r => r[0] === memberId);
  
  if (rowIndex === -1) {
    return jsonResponse({ error: 'Member not found' }, 404);
  }
  
  const today = new Date().toISOString().split('T')[0];
  const currentCount = data[rowIndex][8] || 0;
  
  membersSheet.getRange(rowIndex + 1, 8).setValue(today);
  membersSheet.getRange(rowIndex + 1, 9).setValue(currentCount + 1);
  
  // Add to check-ins log
  checkInsSheet.appendRow([
    `checkin-${Date.now()}`,
    memberId,
    today,
    new Date().toLocaleTimeString(),
    'Main Gym'
  ]);
  
  return jsonResponse({ success: true, checkInCount: currentCount + 1 });
}

// Delete member
function deleteMember(id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Members');
  const data = sheet.getDataRange().getValues();
  
  const rowIndex = data.findIndex(r => r[0] === id);
  if (rowIndex === -1) {
    return jsonResponse({ error: 'Member not found' }, 404);
  }
  
  sheet.deleteRow(rowIndex + 1);
  
  return jsonResponse({ success: true });
}

// Get dashboard stats
function getStats() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Members');
  const data = sheet.getDataRange().getValues();
  
  const members = data.slice(1); // Skip header
  
  const stats = {
    total: members.length,
    active: members.filter(m => m[5] === 'active').length,
    pendingRenewal: members.filter(m => m[5] === 'renewal-pending').length,
    inactive: members.filter(m => m[5] === 'inactive').length,
    registration: members.filter(m => m[5] === 'registration').length
  };
  
  return jsonResponse({ stats });
}

// Helper function for JSON responses
function jsonResponse(data, statusCode = 200) {
  const output = JSON.stringify(data);
  
  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Deploy as Web App

1. **Click Deploy** → New Deployment
2. **Type:** Web app
3. **Execute as:** Me
4. **Who has access:** Anyone
5. **Deploy** → Copy the URL

Your API URL will look like:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

---

## 3. Frontend Integration

### Create API Client

**File:** `src/api/sheets.js`

```javascript
const API_URL = process.env.NEXT_PUBLIC_SHEETS_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_SHEETS_API_KEY;

class SheetsAPI {
  async get(action, params = {}) {
    const url = new URL(API_URL);
    url.searchParams.append('action', action);
    url.searchParams.append('key', API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    const response = await fetch(url);
    return response.json();
  }
  
  async post(action, data) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data, key: API_KEY })
    });
    
    return response.json();
  }
  
  // Member operations
  async getMembers() {
    return this.get('getMembers');
  }
  
  async getMember(id) {
    return this.get('getMember', { id });
  }
  
  async addMember(member) {
    return this.post('addMember', { member });
  }
  
  async updateMember(id, updates) {
    return this.post('updateMember', { id, updates });
  }
  
  async deleteMember(id) {
    return this.post('deleteMember', { id });
  }
  
  async recordCheckIn(memberId) {
    return this.post('recordCheckIn', { memberId });
  }
  
  async getStats() {
    return this.get('getStats');
  }
}

export default new SheetsAPI();
```

### Environment Variables

**File:** `.env.local`

```bash
NEXT_PUBLIC_SHEETS_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
NEXT_PUBLIC_SHEETS_API_KEY=your_secret_api_key
```

### Update Board Hook

**File:** `src/hooks/useBoardSync.js`

Add this to fetch from Sheets instead of config:

```javascript
import sheetsAPI from '@/api/sheets';

export function useBoardSync() {
  // ... existing code ...
  
  // Fetch from Sheets on mount
  useEffect(() => {
    async function fetchFromSheets() {
      try {
        const { members } = await sheetsAPI.getMembers();
        
        // Transform to board format
        const board = transformMembersToBoard(members);
        setBoard(board);
        setHasLoaded(true);
      } catch (error) {
        console.error('Failed to fetch from Sheets:', error);
        // Fallback to local config
        loadFromLocalConfig();
      }
    }
    
    fetchFromSheets();
  }, []);
  
  // ... rest of the code ...
}
```

---

## 4. Testing

### Test API Endpoints

**Using curl:**

```bash
# Get all members
curl "https://script.google.com/macros/s/YOUR_ID/exec?action=getMembers&key=YOUR_KEY"

# Add member
curl -X POST https://script.google.com/macros/s/YOUR_ID/exec \
  -H "Content-Type: application/json" \
  -d '{
    "action": "addMember",
    "key": "YOUR_KEY",
    "member": {
      "title": "Test Member",
      "email": "test@example.com",
      "membershipType": "Basic"
    }
  }'
```

### Test in Frontend

Add a test button in your dashboard:

```javascript
<button onClick={async () => {
  const data = await sheetsAPI.getMembers();
  console.log('Members from Sheets:', data);
}}>
  Test Sheets Connection
</button>
```

---

## 5. Sync Strategy

### Real-time Polling

```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    const { members } = await sheetsAPI.getMembers();
    // Update board if changes detected
  }, 30000); // Every 30 seconds
  
  return () => clearInterval(interval);
}, []);
```

### Optimistic Updates

```javascript
const addMember = async (member) => {
  // Update UI immediately
  setBoard(prev => /* add member locally */);
  
  try {
    // Sync to Sheets
    await sheetsAPI.addMember(member);
  } catch (error) {
    // Rollback on error
    setBoard(prev => /* remove member */);
    alert('Failed to save member');
  }
};
```

---

## 6. Security Best Practices

### Protect Your API Key
- Never commit `.env.local` to Git
- Use different keys for dev/prod
- Rotate keys regularly

### Apps Script Security
- Restrict execution to your Google account
- Enable 2FA on Google account
- Monitor API usage in Apps Script dashboard

### Rate Limiting
Add to Apps Script:

```javascript
const RATE_LIMIT = 100; // requests per minute
const requestCounts = {};

function checkRateLimit(apiKey) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  const key = `${apiKey}-${minute}`;
  
  requestCounts[key] = (requestCounts[key] || 0) + 1;
  
  if (requestCounts[key] > RATE_LIMIT) {
    throw new Error('Rate limit exceeded');
  }
}
```

---

## 7. Error Handling

### Frontend Error Boundaries

```javascript
try {
  await sheetsAPI.getMembers();
} catch (error) {
  if (error.message.includes('Invalid API key')) {
    // Show API key error
  } else if (error.message.includes('Network')) {
    // Show network error
  } else {
    // Fallback to local data
  }
}
```

### Retry Logic

```javascript
async function fetchWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

---

## 8. Troubleshooting

### Common Issues

**1. CORS Errors**
- Apps Script automatically handles CORS
- If issues persist, ensure "Anyone" access in deployment

**2. API Key Invalid**
- Check `.env.local` is loaded
- Verify key matches Apps Script code
- Restart dev server after changing env vars

**3. Data Not Syncing**
- Check browser console for errors
- Verify Sheet ID is correct
- Test API endpoint directly with curl

**4. Slow Performance**
- Reduce polling frequency
- Implement caching
- Use incremental updates instead of full refresh

---

## 9. Migration Guide

### Moving from Local to Sheets

1. **Export current data**
   ```javascript
   const data = localStorage.getItem('kanban-board');
   console.log(data);
   ```

2. **Transform to Sheets format**
3. **Import to Google Sheets**
4. **Enable Sheets API in code**
5. **Test thoroughly**
6. **Switch production flag**

---

## 10. Next Steps

- [ ] Set up Google Sheets
- [ ] Deploy Apps Script
- [ ] Test API endpoints
- [ ] Integrate frontend
- [ ] Test with real data
- [ ] Deploy to production

**Ready to sync? Follow this guide step-by-step!** 🚀
