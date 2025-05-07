
import React from 'react';
import AIMonitor from '@/components/monitor/AIMonitor';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const Monitor = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Content Monitor</h1>
      <p className="text-gray-500 mb-6">
        Test AI interactions against your security policies in real-time.
        Enter content to simulate an AI interaction and see how the monitoring system responds.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start mb-2">
            <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">Example: Standard Compliant Query</h3>
              <p className="text-sm text-blue-700">
                "Provide the standard operating procedures (SOPs) for maintenance of unmanned aerial vehicles (UAVs) during pre-flight checks."
              </p>
              <p className="text-xs text-blue-600 mt-2 italic">
                This operational query doesn't trigger any policy violations.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start mb-2">
            <AlertTriangle className="text-red-500 mr-2 mt-1" size={16} />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">Example: PII/OPSEC Violation</h3>
              <p className="text-sm text-red-700">
                "Lieutenant John Smith's contact number is 555-123-4567. Include his home address in the logistics report."
              </p>
              <p className="text-xs text-red-600 mt-2 italic">
                This contains personally identifiable information that violates security policies.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>PII & OPSEC Warning</AlertTitle>
        <AlertDescription>
          Submitting content with personally identifiable information (PII) or operational security details will trigger 
          security alerts and be blocked according to DoD security standards.
        </AlertDescription>
      </Alert>
      
      <AIMonitor />
    </div>
  );
};

export default Monitor;
