
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
      
      <AIMonitor />
    </div>
  );
};

export default Monitor;
