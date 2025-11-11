# 🏋️ FitOps - Gym Management Dashboard

> Visualize member progress with a Kanban-style interface. Automate tracking through Google Sheets integration.

## Overview

FitOps is a modern gym management dashboard that helps gym owners and managers monitor member journeys from registration to retention. Each member is represented as a card that automatically moves through stages, providing a clear operational overview.

## 🎯 Key Features

### Current (MVP - Phase 1)
- ✅ **Kanban-style Member Tracking** - Visual representation of member journey
- ✅ **4 Stage Pipeline** - Registration → Active → Pending Renewal → Inactive
- ✅ **Member Cards** - Rich information display (contact, membership type, activity stats)
- ✅ **Drag & Drop** - Move members between stages manually
- ✅ **Local Persistence** - Changes saved to localStorage
- ✅ **Real-time Stats** - Dashboard metrics (total members, active, renewals)
- ✅ **Status Badges** - Visual indicators for member status
- ✅ **Renewal Alerts** - Automatic warnings for upcoming renewals
- ✅ **Engagement Tracking** - Check-in counts and last activity

### Coming Soon
- 🔄 **Google Sheets Integration** (Phase 2)
- 📊 **Analytics Dashboard** (Phase 3)
- 📧 **Email Automation** (Phase 4)
- 🤖 **AI Predictions** (Phase 5)

## 🏗️ Architecture

```
┌─────────────────┐
│  Google Form    │ ← Member Registration
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Google Sheets   │ ← Central Data Storage
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Apps Script API │ ← Backend Logic (Phase 2)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ React Kanban UI │ ← Current: Local data
└────────┬────────┘       Future: Live sync
         │
         ↓
┌─────────────────┐
│ Analytics Layer │ ← Insights & Alerts (Phase 3+)
└─────────────────┘
```

## 📊 Member Stages

### 1. Registration (Blue)
**Purpose:** New members awaiting activation
- Completed registration form
- Pending payment confirmation
- Documents being processed

**Actions:**
- Verify payment
- Complete onboarding
- Issue membership card

### 2. Active (Green)
**Purpose:** Engaged, paid-up members
- Regular check-ins
- Active membership
- Good standing

**Metrics Tracked:**
- Last check-in date
- Total visit count
- Attendance frequency
- Engagement level

### 3. Pending Renewal (Orange)
**Purpose:** Members with upcoming renewal deadlines
- Membership expires within 14 days
- Renewal reminder sent
- Follow-up required

**Automated Actions:**
- Email reminders (7 days, 3 days, 1 day)
- SMS notifications
- Dashboard alerts

### 4. Inactive (Red)
**Purpose:** Members who need re-engagement
- No check-in for 30+ days
- Expired membership
- Cancelled subscription

**Actions:**
- Win-back campaigns
- Special offers
- Exit surveys

## 💳 Membership Types

| Type | Icon | Description |
|------|------|-------------|
| **Premium** | ⭐ | Full access + classes |
| **Basic** | 🏋️ | Gym access only |
| **PT Package** | 💪 | Personal training sessions |
| **Family** | 👨‍👩‍👧‍👦 | Multiple family members |
| **Student** | 🎓 | Discounted student rate |

## 🔔 Alert System

### Renewal Alerts
- **Critical** (Red): Expires today or tomorrow
- **Urgent** (Orange): Expires in 2-7 days
- **Warning** (Yellow): Expires in 8-14 days

### Activity Alerts
- **Inactive** (Red): No check-in for 30+ days
- **At Risk** (Orange): No check-in for 14-30 days

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (React)
- **Styling:** TailwindCSS
- **Drag & Drop:** @hello-pangea/dnd
- **State:** React Hooks + Context

### Backend (Coming in Phase 2)
- **API:** Google Apps Script
- **Database:** Google Sheets
- **Auth:** Google OAuth

### Deployment
- **Platform:** Vercel / Netlify
- **Domain:** Custom domain (optional)

## 📁 Project Structure

```
kanban-demo/
├── src/
│   ├── app/
│   │   ├── page.js              # Main dashboard
│   │   └── layout.js            # App layout
│   │
│   ├── component/
│   │   ├── kanban/
│   │   │   ├── Board.jsx        # Kanban board
│   │   │   ├── Column.jsx       # Stage column
│   │   │   └── Card.jsx         # Member card
│   │   └── SyncPrompt.jsx       # Config sync modal
│   │
│   ├── config/
│   │   └── boardConfig.json     # Board configuration
│   │
│   ├── hooks/
│   │   └── useBoardSync.js      # Sync logic
│   │
│   └── utils/
│       ├── statusUtils.js       # Status calculations
│       └── dateUtils.js         # Date formatting
│
├── docs/
│   ├── README.md                # This file
│   ├── roadmap.md               # Development roadmap
│   └── api-integration.md       # API docs (coming)
│
└── automation/                  # Coming in Phase 2
    └── scripts/
        ├── syncSheets.gs        # Google Apps Script
        └── autoReminders.js     # Email automation
```

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Clone the repository
cd kanban-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

Edit `src/config/boardConfig.json` to customize:
- Member stages
- Default members
- Stage colors
- Initial data

**Important:** Increment the `version` field to trigger sync prompt!

```json
{
  "version": "2.0.0",  // Change this to trigger updates
  "board": {
    "stages": [...]
  }
}
```

## 📖 Usage Guide

### Adding New Members

**Method 1: UI**
1. Click "+ Add a card" in any column
2. Enter member name
3. Press Enter
4. Double-click to add details

**Method 2: Config File**
1. Edit `boardConfig.json`
2. Add member object to stage
3. Increment version
4. Refresh browser

### Moving Members
- **Drag & Drop:** Manually move cards between stages
- **Auto-move (Phase 2):** Based on check-in activity and renewal dates

### Editing Member Details
- **Double-click** card to enter edit mode
- Update name, description, etc.
- Press `Ctrl+Enter` to save or `Escape` to cancel

### Managing Stages
- **Click column name** to rename
- Add/remove stages in config file
- Reorder by changing `order` property

## 🔄 Data Sync

### Version Control
FitOps uses version-based sync to detect config changes:

1. **Edit config file** → Change version number
2. **Refresh browser** → Sync modal appears
3. **Choose strategy:**
   - 🔄 **Smart Merge** - Keep members, update structure
   - 📝 **Update Names** - Only update column names
   - 🔃 **Replace All** - Start fresh (⚠️ deletes members)
   - ✋ **Keep Current** - Ignore changes

### LocalStorage Structure
```javascript
{
  "kanban-board": {
    "stages": [...]  // Current board state
  },
  "kanban-board-version": "2.0.0"  // Last synced version
}
```

## 📊 Dashboard Metrics

### Stats Displayed
- **Total Members** - All members across stages
- **Active Members** - Currently active count
- **Pending Renewals** - Members needing renewal
- **Auto-save Status** - Sync indicator

### Calculated Fields
- **Engagement Level** - Based on check-in frequency
  - High: 12+ visits/month (3x/week)
  - Medium: 8+ visits/month (2x/week)
  - Low: < 8 visits/month

## 🎨 Customization

### Colors
Edit stage colors in `boardConfig.json`:
```json
{
  "id": "active",
  "color": "green",  // blue, green, yellow, red, purple
  "name": "Active"
}
```

### Labels
Add custom labels in `Card.jsx`:
```javascript
const labelColors = {
  'your-label': { 
    bg: 'bg-teal-100', 
    text: 'text-teal-800', 
    name: 'Your Label' 
  }
};
```

## 🔐 Security Notes

### Current (Local Development)
- Data stored in browser localStorage
- No authentication required
- Single-user mode

### Production (Phase 2+)
- Google OAuth authentication
- Row-level security in Sheets
- API key encryption
- HTTPS only

## 🐛 Troubleshooting

### Members not appearing
- Check browser console for errors
- Verify JSON syntax in config file
- Clear localStorage and reload

### Drag & drop not working
- Refresh the page
- Check for JavaScript errors
- Ensure proper stage IDs

### Sync prompt not showing
- Increment version in `boardConfig.json`
- Clear browser cache
- Check localStorage version key

## 📞 Support

For issues, questions, or feature requests:
- Check `docs/roadmap.md` for planned features
- Review existing documentation
- Open an issue on GitHub (if applicable)

## 📝 License

MIT License - Feel free to use and modify for your gym!

---

**Built with ❤️ for gym owners who want to focus on members, not spreadsheets.**
