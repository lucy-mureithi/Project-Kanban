import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { getStatusBadge, getMembershipBadge, getMemberAlert } from "@/utils/statusUtils";
import { formatCheckIn, formatRenewal, getUrgencyColor } from "@/utils/dateUtils";

// Available label colors for member tags
const labelColors = {
  new: { bg: 'bg-blue-100', text: 'text-blue-800', name: 'New' },
  active: { bg: 'bg-green-100', text: 'text-green-800', name: 'Active' },
  premium: { bg: 'bg-purple-100', text: 'text-purple-800', name: 'Premium' },
  basic: { bg: 'bg-gray-100', text: 'text-gray-800', name: 'Basic' },
  pt: { bg: 'bg-indigo-100', text: 'text-indigo-800', name: 'PT' },
  'renewal-due': { bg: 'bg-orange-100', text: 'text-orange-800', name: 'Renewal Due' },
  inactive: { bg: 'bg-red-100', text: 'text-red-800', name: 'Inactive' },
  'at-risk': { bg: 'bg-red-100', text: 'text-red-800', name: 'At Risk' },
  regular: { bg: 'bg-teal-100', text: 'text-teal-800', name: 'Regular' },
  morning: { bg: 'bg-yellow-100', text: 'text-yellow-800', name: 'Morning' },
};

export default function Card({ card: member, index, onEditCard, onDeleteCard }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(member.title);
  const [editedDescription, setEditedDescription] = useState(member.description);
  
  // Get member-specific data
  const statusBadge = getStatusBadge(member.status || 'active');
  const membershipBadge = getMembershipBadge(member.membershipType || 'Basic');
  const alert = getMemberAlert(member);
  const renewalInfo = member.renewalDate ? formatRenewal(member.renewalDate) : null;
  const urgencyColors = renewalInfo ? getUrgencyColor(renewalInfo.urgency) : null;

  const handleSave = () => {
    if (editedTitle.trim()) {
      onEditCard(member.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(member.title);
    setEditedDescription(member.description);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Draggable draggableId={member.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="bg-white rounded-md shadow-sm border-2 border-blue-300 p-3"
            style={provided.draggableProps.style}
          >
            {/* Edit Mode */}
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full text-sm font-medium text-gray-800 mb-2 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              autoFocus
            />
            
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add description..."
              className="w-full text-xs text-gray-600 mb-2 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
              rows="3"
            />
            
            <div className="flex justify-between items-center text-xs">
              <div className="text-gray-500">
                Press Ctrl+Enter to save, Esc to cancel
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }

  return (
    <Draggable draggableId={member.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-md shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer ${
            snapshot.isDragging ? 'rotate-5 shadow-lg' : ''
          }`}
          style={provided.draggableProps.style}
          onDoubleClick={() => setIsEditing(true)}
        >
          {/* Member Header with Status & Membership */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{member.title}</h3>
              <div className="flex flex-wrap gap-1">
                <span className={`text-xs px-2 py-0.5 rounded ${statusBadge.bg} ${statusBadge.text}`}>
                  {statusBadge.label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${membershipBadge.bg} ${membershipBadge.text}`}>
                  {membershipBadge.icon} {member.membershipType}
                </span>
              </div>
            </div>
          </div>
          
          {/* Description */}
          {member.description && (
            <p className="text-xs text-gray-600 mb-2">{member.description}</p>
          )}
          
          {/* Member Details */}
          <div className="space-y-1 mb-2">
            {member.email && (
              <div className="flex items-center text-xs text-gray-600">
                <span className="mr-1">✉️</span>
                <span className="truncate">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center text-xs text-gray-600">
                <span className="mr-1">📞</span>
                <span>{member.phone}</span>
              </div>
            )}
          </div>
          
          {/* Activity Stats */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {member.lastCheckIn && (
                <div>
                  <div className="text-gray-500">Last Check-in</div>
                  <div className="font-medium text-gray-800">{formatCheckIn(member.lastCheckIn)}</div>
                </div>
              )}
              {member.checkInCount !== undefined && (
                <div>
                  <div className="text-gray-500">Total Visits</div>
                  <div className="font-medium text-gray-800">{member.checkInCount}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Renewal Alert */}
          {renewalInfo && renewalInfo.urgency !== 'normal' && (
            <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${urgencyColors.bg} ${urgencyColors.text}`}>
              🔔 {renewalInfo.text}
            </div>
          )}
          
          {/* Labels */}
          {member.labels && member.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {member.labels.slice(0, 3).map((label, index) => {
                const labelConfig = labelColors[label] || { bg: 'bg-gray-100', text: 'text-gray-800', name: label };
                return (
                  <span
                    key={index}
                    className={`text-xs px-1.5 py-0.5 rounded ${labelConfig.bg} ${labelConfig.text}`}
                  >
                    {labelConfig.name}
                  </span>
                );
              })}
            </div>
          )}
          
          {/* Footer with Actions */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              {member.joinDate && (
                <span className="text-gray-500">
                  Member since {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
            
            {/* Card Actions */}
            <div className="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-gray-400 hover:text-blue-600 p-1"
                title="Edit card"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Remove ${member.title} from the system?`)) {
                    onDeleteCard(member.id);
                  }
                }}
                className="text-gray-400 hover:text-red-600 p-1"
                title="Delete card"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {/* Edit Hint */}
          <div className="text-xs text-gray-400 mt-2 text-center">
            Double-click to edit
          </div>
        </div>
      )}
    </Draggable>
  );
}