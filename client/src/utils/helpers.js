export const STAGES = ['Applied', 'Interview', 'Offer', 'Rejected'];

export const getStageBadgeClass = (stage) => {
  switch (stage) {
    case 'Applied':
      return 'stage-applied';
    case 'Interview':
      return 'stage-interview';
    case 'Offer':
      return 'stage-offer';
    case 'Rejected':
      return 'stage-rejected';
    default:
      return 'bg-gray-800 text-gray-300 border-gray-700';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getFollowUpStatus = (followUpDate, stage) => {
  // Rejected applications do NOT generate active warnings
  if (!followUpDate || stage === 'Rejected') return { status: 'none', text: 'No follow-up', badgeClass: 'hidden' };

  const todayStr = new Date().toISOString().split('T')[0];
  const targetStr = new Date(followUpDate).toISOString().split('T')[0];

  if (targetStr === todayStr) {
    return {
      status: 'today',
      text: 'Follow up today',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
    };
  }

  if (targetStr < todayStr) {
    return {
      status: 'overdue',
      text: `Overdue (${formatDate(followUpDate)})`,
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    };
  }

  return {
    status: 'upcoming',
    text: `Follow up: ${formatDate(followUpDate)}`,
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  };
};
