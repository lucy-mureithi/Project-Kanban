/**
 * FitOps Status Utilities
 * Handles member status calculations and transitions
 */

/**
 * Calculate member status based on check-in activity and renewal date
 * @param {Object} member - Member data
 * @returns {string} - Status: active, pending-renewal, inactive, registration
 */
export function calculateMemberStatus(member) {
  if (!member.lastCheckIn) {
    return 'registration';
  }

  const now = new Date();
  const lastCheckIn = new Date(member.lastCheckIn);
  const daysSinceCheckIn = Math.floor((now - lastCheckIn) / (1000 * 60 * 60 * 24));

  // Check renewal date
  if (member.renewalDate) {
    const renewalDate = new Date(member.renewalDate);
    const daysUntilRenewal = Math.floor((renewalDate - now) / (1000 * 60 * 60 * 24));

    // Pending renewal (within 14 days)
    if (daysUntilRenewal <= 14 && daysUntilRenewal >= 0) {
      return 'pending-renewal';
    }

    // Expired
    if (daysUntilRenewal < 0) {
      return 'inactive';
    }
  }

  // Inactive (no check-in for 30+ days)
  if (daysSinceCheckIn > 30) {
    return 'inactive';
  }

  // Active
  return 'active';
}

/**
 * Determine which stage a member should be in
 * @param {Object} member - Member data
 * @returns {string} - Stage ID
 */
export function getMemberStage(member) {
  const status = calculateMemberStatus(member);

  const stageMap = {
    'registration': 'registration',
    'pending-payment': 'registration',
    'pending-activation': 'registration',
    'active': 'active',
    'pending-renewal': 'pending-renewal',
    'renewal-pending': 'pending-renewal',
    'inactive': 'inactive',
    'at-risk': 'inactive'
  };

  return stageMap[status] || stageMap[member.status] || 'registration';
}

/**
 * Get status badge color
 * @param {string} status - Member status
 * @returns {Object} - Tailwind classes for badge
 */
export function getStatusBadge(status) {
  const badges = {
    'registration': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'New'
    },
    'pending-payment': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Payment Pending'
    },
    'pending-activation': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Activating'
    },
    'active': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Active'
    },
    'pending-renewal': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'Renewal Due'
    },
    'renewal-pending': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'Renewal Due'
    },
    'inactive': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Inactive'
    },
    'at-risk': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'At Risk'
    }
  };

  return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };
}

/**
 * Get membership type badge
 * @param {string} type - Membership type
 * @returns {Object} - Tailwind classes for badge
 */
export function getMembershipBadge(type) {
  const badges = {
    'Premium': {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      icon: '⭐'
    },
    'Basic': {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: '🏋️'
    },
    'PT Package': {
      bg: 'bg-indigo-100',
      text: 'text-indigo-800',
      icon: '💪'
    },
    'Family': {
      bg: 'bg-pink-100',
      text: 'text-pink-800',
      icon: '👨‍👩‍👧‍👦'
    },
    'Student': {
      bg: 'bg-cyan-100',
      text: 'text-cyan-800',
      icon: '🎓'
    }
  };

  return badges[type] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🏃' };
}

/**
 * Check if member needs attention (renewal due, inactive, etc.)
 * @param {Object} member - Member data
 * @returns {Object} - Alert info
 */
export function getMemberAlert(member) {
  const now = new Date();

  // Check renewal
  if (member.renewalDate) {
    const renewalDate = new Date(member.renewalDate);
    const daysUntilRenewal = Math.floor((renewalDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntilRenewal <= 7 && daysUntilRenewal >= 0) {
      return {
        type: 'urgent',
        message: `Renewal in ${daysUntilRenewal} day${daysUntilRenewal !== 1 ? 's' : ''}`,
        action: 'Send reminder'
      };
    }

    if (daysUntilRenewal < 0) {
      return {
        type: 'expired',
        message: 'Membership expired',
        action: 'Contact member'
      };
    }
  }

  // Check activity
  if (member.lastCheckIn) {
    const lastCheckIn = new Date(member.lastCheckIn);
    const daysSinceCheckIn = Math.floor((now - lastCheckIn) / (1000 * 60 * 60 * 24));

    if (daysSinceCheckIn > 30) {
      return {
        type: 'inactive',
        message: `No check-in for ${daysSinceCheckIn} days`,
        action: 'Engagement outreach'
      };
    }

    if (daysSinceCheckIn > 14) {
      return {
        type: 'warning',
        message: `Last seen ${daysSinceCheckIn} days ago`,
        action: 'Check-in reminder'
      };
    }
  }

  return null;
}

/**
 * Calculate engagement level based on check-in frequency
 * @param {Object} member - Member data
 * @returns {string} - high, medium, low
 */
export function getEngagementLevel(member) {
  if (!member.checkInCount || !member.joinDate) return 'unknown';

  const now = new Date();
  const joinDate = new Date(member.joinDate);
  const monthsMember = Math.max(1, Math.floor((now - joinDate) / (1000 * 60 * 60 * 24 * 30)));
  const avgCheckInsPerMonth = member.checkInCount / monthsMember;

  if (avgCheckInsPerMonth >= 12) return 'high'; // 3+ times per week
  if (avgCheckInsPerMonth >= 8) return 'medium'; // 2+ times per week
  return 'low';
}
