# Quick Start Guide - Bidirectional Kanban Sync

## 🎯 What Changed?

Your Kanban board now supports **two-way sync** between code and UI!

## 📁 Key Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `src/config/boardConfig.json` | Source of truth for board structure | When you want code changes to reflect in UI |
| `src/hooks/useBoardSync.js` | Sync logic | Don't need to edit |
| `src/component/SyncPrompt.jsx` | Sync modal | Don't need to edit |

## 🚀 How to Use

### Edit Columns in UI
```
1. Click any column name
2. Type new name
3. Press Enter
✅ Auto-saves to localStorage
```

### Edit Columns in Code
```
1. Open src/config/boardConfig.json
2. Edit column names
3. Change version: "1.0.0" → "1.0.1"
4. Save file
5. Refresh browser
6. Choose sync strategy (use "Smart Merge")
✅ Code changes now in UI!
```

## 🔄 Sync Strategies

When you edit code, a modal appears with options:

| Strategy | What It Does | Use When |
|----------|--------------|----------|
| 🔄 **Smart Merge** | Keep cards, update structure | Most updates (RECOMMENDED) |
| 📝 **Update Names** | Keep everything, update names only | Simple renames |
| 🔃 **Replace All** | Delete everything, load from code | Starting fresh ⚠️ |
| ✋ **Keep Current** | Ignore code changes | You want to skip |

## 💡 Examples

### Example 1: Rename a column from code

**Before:**
```json
{
  "version": "1.0.0",
  "board": {
    "stages": [
      { "id": "stage-1", "name": "To Do", "order": 0, "cards": [] }
    ]
  }
}
```

**After:**
```json
{
  "version": "1.0.1",  ← Changed!
  "board": {
    "stages": [
      { "id": "stage-1", "name": "Backlog", "order": 0, "cards": [] }  ← Changed!
    ]
  }
}
```

**Result:** Refresh → Modal appears → Choose "Smart Merge" → Column renamed!

### Example 2: Add a new column

```json
{
  "version": "1.1.0",  ← Incremented
  "board": {
    "stages": [
      { "id": "stage-1", "name": "Backlog", "order": 0, "cards": [] },
      { "id": "stage-7", "name": "Testing", "order": 6, "cards": [] }  ← New!
    ]
  }
}
```

**Result:** New column appears, all cards preserved!

## 🎮 UI Features

- **Click column name** → Edit mode
- **Double-click card** → Edit card
- **Drag cards** → Move between columns
- **+ Add card** → Create new card
- **🔄 Reload Config** → Force load from file
- **🗑️ Reset Board** → Clear all, start fresh

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Modal not showing | Increment `version` in config |
| Changes not saving | Check browser console for errors |
| Lost data | Use "Smart Merge" instead of "Replace All" |
| Column name reverts | Edit config + increment version |

## 📊 File Structure

```
kanban-demo/
├── src/
│   ├── config/
│   │   └── boardConfig.json      ← Edit this!
│   ├── hooks/
│   │   └── useBoardSync.js       ← Sync magic
│   ├── component/
│   │   ├── SyncPrompt.jsx        ← Modal
│   │   └── kanban/
│   │       ├── Board.jsx
│   │       ├── Column.jsx        ← Now editable
│   │       └── Card.jsx
│   └── app/
│       └── page.js               ← Main app
├── SYNC_GUIDE.md                 ← Full documentation
└── QUICK_START.md                ← This file
```

## 🎯 Best Practices

1. ✅ **Always increment version** when editing config
2. ✅ **Use Smart Merge** for most updates
3. ✅ **Test locally** before committing config changes
4. ✅ **Edit config file** instead of hardcoding in `page.js`
5. ❌ **Don't use Replace All** unless you want to lose data

## 🔗 Resources

- **Full Guide:** See `SYNC_GUIDE.md` for detailed documentation
- **Development:** `npm run dev` to start server
- **Browser:** http://localhost:3000

## ⚡ Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

**Ready to go!** Start by editing `src/config/boardConfig.json` and incrementing the version.
