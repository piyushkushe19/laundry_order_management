import React from 'react';

const STATUS_CONFIG = {
  RECEIVED: { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', label: 'Received' },
  PROCESSING: { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500', label: 'Processing' },
  READY: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Ready' },
  DELIVERED: { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Delivered' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.RECEIVED;
  return (
    <span className={`status-badge ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} />
      {config.label}
    </span>
  );
}
