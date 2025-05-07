
import React from 'react';
import AIMonitor from '@/components/monitor/AIMonitor';

const Monitor = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Content Monitor</h1>
      <p className="text-gray-500 mb-6">
        Test AI interactions against your security policies in real-time.
        Enter content to simulate an AI interaction and see how the monitoring system responds.
      </p>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Example: Standard Compliant Query</h3>
        <p className="text-sm text-blue-700">
          "Provide the standard operating procedures (SOPs) for maintenance of unmanned aerial vehicles (UAVs) during pre-flight checks."
        </p>
        <p className="text-xs text-blue-600 mt-2 italic">
          This operational query doesn't trigger any policy violations and shows how the system handles compliant content.
        </p>
      </div>
      
      <AIMonitor />
    </div>
  );
};

export default Monitor;
