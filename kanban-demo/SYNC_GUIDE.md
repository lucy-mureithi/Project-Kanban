# Kanban Board Configuration & Sync Guide

## Overview

Your Kanban board now supports **bidirectional synchronization** between code and UI:

- ✅ **Code edits automatically update the UI** when you change the configuration file
- ✅ **UI edits work dynamically** and persist across sessions
- ✅ **Smart merging** keeps your work safe when syncing changes
- ✅ **Column names are editable** both in code and UI

## How It Works

### Architecture

```
┌─────────────────────────┐
│  boardConfig.json       │  ← Edit here for code changes
│  (Source of Truth)      │
└───────────┬─────────────┘
            │
            ↓
    ┌───────────────┐
    │  useBoardSync │  ← Manages synchronization
    │  Hook         │
    └───────┬───────┘
            │
            ↓
┌───────────────────────────┐
│  localStorage             │  ← Stores runtime changes
│  (User's Dynamic Changes) │
└───────────────────────────┘
```

### Configuration File

Your board configuration lives in:
```
src/config/boardConfig.json
```

**Structure:**
```json
{
  "version": "1.0.0",  ← Increment this to trigger sync
  "board": {
    "stages": [
      {
        "id": "stage-1",
        "name": "Backlog",
        "order": 0,
        "cards": [...]
      }
    ]
  }
}
```

## Usage Guide

### 1. Editing Column Names in UI

**Method 1: Click the column name**
- Click on any column header
- Type the new name
- Press `Enter` or click the ✓ button
- Press `Escape` to cancel

**Method 2: Edit the config file**
- Open `src/config/boardConfig.json`
- Change the `name` field of any stage
- Increment the `version` number
- Save the file
- Refresh the browser
- Choose a sync strategy from the prompt

### 2. Editing Column Names in Code

When you want to update columns from the code:

1. **Open the config file:**
   ```bash
   src/config/boardConfig.json
   ```

2. **Edit the column names:**
   ```json
   {
     "version": "1.0.0",  ← Change to "1.0.1" or "2.0.0"
     "board": {
       "stages": [
         {
           "id": "stage-1",
           "name": "Updated Backlog",  ← Your changes
           "order": 0,
           "cards": [...]
         }
       ]
     }
   }
   ```

3. **Increment the version:**
   ```json
   "version": "1.0.1"  ← Must be different from previous
   ```

4. **Refresh the browser:**
   - A sync prompt will appear automatically
   - Choose your preferred sync strategy

### 3. Sync Strategies

When the config version changes, you'll see a modal with these options:

#### 🔄 Smart Merge (Recommended)
- **Keeps:** All your cards and progress
- **Updates:** Column names and structure from code
- **Best for:** Regular updates where you want to preserve work

#### 📝 Update Column Names Only
- **Keeps:** Everything you have
- **Updates:** Only column names and order from code
- **Best for:** Simple renaming without structural changes

#### 🔃 Replace All
- **Keeps:** Nothing
- **Updates:** Everything from code
- **⚠️ Warning:** Deletes all your cards!
- **Best for:** Starting fresh or major restructuring

#### ✋ Keep Current State
- **Keeps:** Everything as is
- **Updates:** Nothing (just marks version as synced)
- **Best for:** When you want to ignore code changes

### 4. Adding/Removing Columns

**Via UI:**
- Currently not supported (coming soon!)
- Use the config file for now

**Via Code:**
1. Edit `src/config/boardConfig.json`
2. Add/remove stages in the `stages` array
3. Increment the version
4. Use "Smart Merge" to keep your cards

Example - Adding a new column:
```json
{
  "id": "stage-7",
  "name": "Testing",
  "order": 6,
  "cards": []
}
```

### 5. Managing Cards

**All card operations work from the UI:**
- Add cards: Click "+ Add a card"
- Edit cards: Double-click on any card
- Delete cards: Click the 🗑️ icon
- Move cards: Drag and drop

**Changes are auto-saved to localStorage**

## Advanced Features

### Manual Reload

Click the **🔄 Reload Config** button to:
- Force reload from `boardConfig.json`
- Useful after editing the config file
- Bypasses the sync prompt

### Reset Board

Click the **🗑️ Reset Board** button to:
- Clear all localStorage data
- Reload fresh from config
- Start with a clean slate

### Versioning Best Practices

1. **Semantic Versioning:**
   - `1.0.0` → `1.0.1`: Minor updates (column renames)
   - `1.0.0` → `1.1.0`: New columns added
   - `1.0.0` → `2.0.0`: Major restructuring

2. **When to increment:**
   - ✅ When changing column names
   - ✅ When adding/removing columns
   - ✅ When changing default cards
   - ❌ NOT for UI-only changes (they auto-save)

## Troubleshooting

### Sync prompt not appearing

**Cause:** Version not incremented
**Fix:** Update the `version` in `boardConfig.json`

### Lost data after sync

**Cause:** Used "Replace All" strategy
**Fix:** No undo available - use localStorage backup if you have one
**Prevention:** Always use "Smart Merge" unless you want to reset

### Column names reverting

**Cause:** Old localStorage version taking precedence
**Fix:** 
1. Increment version in config
2. Use "Update Column Names Only"

### Changes not saving

**Cause:** localStorage might be full or disabled
**Fix:** 
1. Check browser console for errors
2. Check if localStorage is enabled
3. Clear old data using Reset Board

## File Structure

```
src/
├── config/
│   └── boardConfig.json          ← Edit this for code changes
├── hooks/
│   └── useBoardSync.js           ← Sync logic
├── component/
│   ├── SyncPrompt.jsx            ← Sync modal UI
│   └── kanban/
│       ├── Board.jsx
│       ├── Column.jsx            ← Now supports editing
│       └── Card.jsx
└── app/
    └── page.js                   ← Main app using the hook
```

## Tips & Best Practices

1. **Make code changes in the config file only**
   - Don't edit `page.js` for board structure anymore
   - All defaults should be in `boardConfig.json`

2. **Increment version after every config change**
   - This triggers the sync prompt
   - Helps users know when to update

3. **Use Smart Merge for most updates**
   - Preserves user work
   - Updates structure as needed

4. **Commit config changes carefully**
   - Version increments affect all users
   - Document breaking changes in commit messages

5. **Test locally first**
   - Try different sync strategies
   - Verify cards are preserved correctly

## Example Workflow

### Scenario: Renaming columns for a new sprint

1. **Edit config:**
   ```json
   {
     "version": "1.1.0",  ← Incremented from 1.0.0
     "board": {
       "stages": [
         {
           "id": "stage-2",
           "name": "Sprint 2 - In Progress",  ← Updated
           "order": 1,
           "cards": []
         }
       ]
     }
   }
   ```

2. **Save and refresh browser**

3. **Sync prompt appears:**
   - Choose "Smart Merge"
   - All cards preserved
   - Column names updated

4. **Continue working:**
   - Edit columns from UI if needed
   - Add/move cards as usual
   - Everything auto-saves

## Future Enhancements

Planned features:
- [ ] Add/remove columns from UI
- [ ] Backend sync (beyond localStorage)
- [ ] Multi-user collaboration
- [ ] Undo/redo functionality
- [ ] Export/import board configurations
- [ ] Drag-to-reorder columns

---

**Need help?** Check the code comments in:
- `src/hooks/useBoardSync.js` - Sync logic documentation
- `src/component/SyncPrompt.jsx` - UI implementation
