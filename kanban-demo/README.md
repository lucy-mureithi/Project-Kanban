# 🏋️ FitOps - Gym Management Dashboard

> **Transform member tracking from spreadsheets to visual automation**

FitOps is a modern gym management dashboard that visualizes member journeys using a Kanban-style interface. Track registrations, monitor activity, automate renewals, and boost retention — all in one intuitive platform.

![FitOps Dashboard](https://img.shields.io/badge/Status-Phase%201%20Complete-success)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

---

## ✨ Features

### Current (MVP)
✅ **Visual Member Tracking** - Kanban board with 4 stages (Registration → Active → Pending Renewal → Inactive)  
✅ **Rich Member Cards** - Name, contact, membership type, check-in stats, renewal alerts  
✅ **Drag & Drop** - Move members between stages seamlessly  
✅ **Smart Alerts** - Automatic renewal warnings and activity tracking  
✅ **Dashboard Stats** - Real-time metrics (total members, active count, pending renewals)  
✅ **Auto-save** - Changes persist in localStorage  
✅ **Configurable** - Edit stages and members via JSON config file  

### Coming Soon
🔄 **Google Sheets Integration** (Phase 2) - Sync with your existing data  
📊 **Analytics Dashboard** (Phase 3) - Insights, trends, and reports  
📧 **Email Automation** (Phase 4) - Renewal reminders and engagement campaigns  
🤖 **AI Predictions** (Phase 5) - Churn risk scoring and retention recommendations  

---

## 🚀 Quick Start

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
# Clone or navigate to the project
cd kanban-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see FitOps in action! 🎉

---

## 📖 Project Structure

```
fitops/
├── src/
│   ├── app/
│   │   ├── page.js              # Main dashboard
│   │   └── layout.js            # App layout
│   │
│   ├── component/
│   │   ├── kanban/
│   │   │   ├── Board.jsx        # Kanban board
│   │   │   ├── Column.jsx       # Stage column (editable)
│   │   └── Card.jsx         # Member card (gym-specific)
│   │   └── SyncPrompt.jsx       # Config sync modal
│   │
│   ├── config/
│   │   └── boardConfig.json     # 👈 Edit this for members/stages
│   │
│   ├── hooks/
│   │   └── useBoardSync.js      # Sync & state management
│   │
│   └── utils/
│       ├── statusUtils.js       # Member status calculations
│       └── dateUtils.js         # Date formatting & renewal logic
│
├── docs/
│   ├── README.md                # Full documentation
│   ├── roadmap.md               # Development phases
│   └── api-integration.md       # Google Sheets setup guide
│
└── automation/                  # Coming in Phase 2
    └── scripts/
        └── syncSheets.gs        # Google Apps Script
```

---

## 🎯 How It Works

### Member Journey Flow

```
Registration → Active → Pending Renewal → Inactive
     ↓            ↓            ↓              ↓
New signups   Regular      14 days to    30+ days
awaiting     attendees    expiration    no activity
activation
```

### Stage Details

| Stage | Color | Criteria | Actions |
|-------|-------|----------|---------|
| **Registration** | 🔵 Blue | New members, payment pending | Verify payment, activate |
| **Active** | 🟢 Green | Regular check-ins, paid-up | Monitor engagement |
| **Pending Renewal** | 🟠 Orange | Expires within 14 days | Send reminders, follow up |
| **Inactive** | 🔴 Red | No check-in 30+ days | Win-back campaign |

---

## 🛠️ Configuration

### Editing Members & Stages

**File:** `src/config/boardConfig.json`

```json
{
  "version": "2.0.0",  // ← Increment to trigger sync
  "board": {
    "stages": [
      {
        "id": "active",
        "name": "Active",
        "order": 1,
        "color": "green",
        "cards": [
          {
            "id": "member-3",
            "title": "Emily Rodriguez",
            "email": "emily.r@email.com",
            "membershipType": "Premium",
            "lastCheckIn": "2024-11-03",
            "checkInCount": 36,
            "renewalDate": "2024-12-15",
            "status": "active"
          }
        ]
      }
    ]
  }
}
```

**To update:**
1. Edit `boardConfig.json`
2. Increment `version` (e.g., "2.0.0" → "2.0.1")
3. Save file
4. Refresh browser
5. Choose sync strategy from modal

---

## 💡 Usage Examples

### Add New Member (UI)
1. Click `+ Add a card` in any column
2. Enter member name
3. Press Enter
4. Double-click card to add details

### Move Member Between Stages
- **Drag & drop** cards to change stages
- Useful for manual stage adjustments

### Edit Member Details
- **Double-click** any card
- Update name, description, etc.
- Press `Ctrl+Enter` to save

### Rename Stages
- **Click** column header
- Type new name
- Press `Enter` to save

### View Alerts
- Renewal warnings show automatically
- Red/orange badges for urgent items

---

## 📊 Dashboard Metrics

The header displays real-time stats:

- **Total Members** - All members across all stages
- **Active Members** - Currently active count
- **Pending Renewals** - Members needing renewal attention
- **Auto-save Status** - Changes synced indicator

---

## 🎨 Membership Types

| Type | Icon | Description |
|------|------|-------------|
| Premium | ⭐ | Full gym access + classes |
| Basic | 🏋️ | Gym equipment only |
| PT Package | 💪 | Personal training sessions |
| Family | 👨‍👩‍👧‍👦 | Multi-member household |
| Student | 🎓 | Discounted student rate |

Edit membership types in `src/utils/statusUtils.js`

---

## 🔄 Syncing with Code Changes

FitOps uses **version-based sync** to detect config updates:

### Sync Strategies

When you edit `boardConfig.json` and increment the version:

1. **🔄 Smart Merge (Recommended)**
   - Keeps all your member data
   - Updates column names and structure from code
   - Best for: Regular updates

2. **📝 Update Column Names Only**
   - Preserves everything
   - Only updates stage names/order
   - Best for: Simple renames

3. **🔃 Replace All**
   - Discards current data
   - Loads fresh from config
   - ⚠️ Use carefully - deletes members!

4. **✋ Keep Current State**
   - Ignores code changes
   - Marks version as synced
   - Best for: Skipping updates

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Complete)
- Local Kanban board
- Member tracking
- Dashboard metrics

### 🚧 Phase 2: Integration (In Progress)
- Google Sheets sync
- Apps Script backend
- Real-time data updates

### 📋 Phase 3: Analytics (Planned)
- Dashboard insights
- Attendance trends
- Revenue metrics

### 📋 Phase 4: Automation (Planned)
- Email reminders
- Auto-stage transitions
- Engagement campaigns

### 📋 Phase 5: AI (Planned)
- Churn prediction
- Retention recommendations
- Smart insights

**See full roadmap:** [`docs/roadmap.md`](docs/roadmap.md)

---

## 📚 Documentation

- **[Full Documentation](docs/README.md)** - Complete feature guide
- **[Development Roadmap](docs/roadmap.md)** - Phases and timeline
- **[API Integration Guide](docs/api-integration.md)** - Google Sheets setup
- **[Quick Start](QUICK_START.md)** - Sync system guide (legacy)
- **[Sync Guide](SYNC_GUIDE.md)** - Version control details (legacy)

---

## 🤝 Contributing

Want to help build FitOps?

1. **Pick a feature** from [`docs/roadmap.md`](docs/roadmap.md)
2. **Fork the repo** (if applicable)
3. **Create a branch** for your feature
4. **Submit a PR** with clear description

### Priority Areas
- 🔥 Phase 2: Google Sheets integration
- ⭐ Phase 3: Analytics dashboard
- 💡 Phase 4: Email automation

---

## 🐛 Troubleshooting

### Common Issues

**Members not showing?**
- Check browser console for errors
- Verify `boardConfig.json` syntax
- Clear localStorage and reload

**Drag & drop not working?**
- Refresh the page
- Check for JavaScript errors
- Ensure proper stage IDs

**Sync modal not appearing?**
- Increment version in `boardConfig.json`
- Clear browser cache
- Check localStorage version key

**Need more help?** See full troubleshooting in [`docs/README.md`](docs/README.md)

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder
```

### Environment Variables

For Phase 2+ (Google Sheets):
```bash
NEXT_PUBLIC_SHEETS_API_URL=your_apps_script_url
NEXT_PUBLIC_SHEETS_API_KEY=your_api_key
```

---

## 📄 License

MIT License - Feel free to use and modify for your gym!

---

## 🎯 Built For

- **Gym Owners** - Visualize your member pipeline
- **Fitness Managers** - Track engagement and renewals
- **Personal Trainers** - Manage client progress
- **Studios** - Monitor class attendance and retention

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [TailwindCSS](https://tailwindcss.com)
- Drag & Drop by [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)

---

**🏋️ FitOps - Because managing your gym should be as easy as a workout!**

*Questions? Ideas? Open an issue or check the docs!*