/**
 * FitOps Date Utilities
 * Handles date formatting and calculations
 */

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: short, long, relative
 * @returns {string} - Formatted date
 */
export function formatDate(date, format = 'short') {
  if (!date) return 'N/A';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffMs = d - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (format) {
    case 'relative':
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
      if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
      if (diffDays < -7 && diffDays >= -30) return `${Math.floor(Math.abs(diffDays) / 7)} weeks ago`;
      if (diffDays > 7) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    case 'long':
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

    case 'short':
    default:
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
  }
}

/**
 * Calculate days between two dates
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date (defaults to now)
 * @returns {number} - Days difference (can be negative)
 */
export function daysBetween(date1, date2 = new Date()) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
  
  const diffMs = d2 - d1;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is within range
 * @param {string|Date} date - Date to check
 * @param {number} days - Number of days
 * @returns {boolean}
 */
export function isWithinDays(date, days) {
  const diff = daysBetween(new Date(), date);
  return diff !== null && Math.abs(diff) <= days;
}

/**
 * Get days until date
 * @param {string|Date} date - Future date
 * @returns {number} - Days until (negative if past)
 */
export function daysUntil(date) {
  const now = new Date();
  const target = new Date(date);
  
  if (isNaN(target.getTime())) return null;
  
  const diffMs = target - now;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get days since date
 * @param {string|Date} date - Past date
 * @returns {number} - Days since (negative if future)
 */
export function daysSince(date) {
  return -daysUntil(date);
}

/**
 * Format check-in time to relative string
 * @param {string|Date} date - Check-in date
 * @returns {string} - Human readable string
 */
export function formatCheckIn(date) {
  if (!date) return 'Never';
  
  const days = daysSince(date);
  
  if (days < 0) return 'In the future?'; // Shouldn't happen
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

/**
 * Format renewal date with urgency indicator
 * @param {string|Date} date - Renewal date
 * @returns {Object} - { text, urgency, days }
 */
export function formatRenewal(date) {
  if (!date) return { text: 'No renewal date', urgency: 'none', days: null };
  
  const days = daysUntil(date);
  
  if (days === null) return { text: 'Invalid date', urgency: 'none', days: null };
  
  let urgency = 'normal';
  let text = '';
  
  if (days < 0) {
    urgency = 'expired';
    text = `Expired ${Math.abs(days)} days ago`;
  } else if (days === 0) {
    urgency = 'critical';
    text = 'Expires today!';
  } else if (days === 1) {
    urgency = 'critical';
    text = 'Expires tomorrow!';
  } else if (days <= 7) {
    urgency = 'urgent';
    text = `Expires in ${days} days`;
  } else if (days <= 14) {
    urgency = 'warning';
    text = `Expires in ${days} days`;
  } else if (days <= 30) {
    urgency = 'normal';
    text = formatDate(date, 'short');
  } else {
    urgency = 'normal';
    text = formatDate(date, 'short');
  }
  
  return { text, urgency, days };
}

/**
 * Get urgency color classes
 * @param {string} urgency - Urgency level
 * @returns {Object} - Tailwind classes
 */
export function getUrgencyColor(urgency) {
  const colors = {
    'expired': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    'critical': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    'urgent': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    'warning': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    'normal': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
    'none': { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' }
  };
  
  return colors[urgency] || colors.normal;
}

/**
 * Calculate membership duration
 * @param {string|Date} joinDate - Join date
 * @returns {string} - Human readable duration
 */
export function getMembershipDuration(joinDate) {
  if (!joinDate) return 'Unknown';
  
  const days = daysSince(joinDate);
  
  if (days < 0) return 'Future join date?';
  if (days === 0) return 'Today';
  if (days < 30) return `${days} days`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years}y ${months}m`;
}

/**
 * Get current month/year for display
 * @returns {string}
 */
export function getCurrentPeriod() {
  const now = new Date();
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Check if date is today
 * @param {string|Date} date
 * @returns {boolean}
 */
export function isToday(date) {
  const d = new Date(date);
  const today = new Date();
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
}

/**
 * Check if date is past
 * @param {string|Date} date
 * @returns {boolean}
 */
export function isPast(date) {
  const d = new Date(date);
  const now = new Date();
  return d < now;
}
