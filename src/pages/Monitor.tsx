
import React from 'react';
import AIMonitor from '@/components/monitor/AIMonitor';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Monitor = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Content Monitor</h1>
      <p className="text-gray-500 mb-6">
        Test AI interactions against your security policies in real-time.
        Enter content to simulate an AI interaction and see how the monitoring system responds.
      </p>
      
      <Tabs defaultValue="examples" className="mb-6">
        <TabsList>
          <TabsTrigger value="examples">Demo Scenarios</TabsTrigger>
          <TabsTrigger value="info">System Information</TabsTrigger>
        </TabsList>
        <TabsContent value="examples" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start mb-2">
                <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Compliant Query</h3>
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
                  <h3 className="text-sm font-medium text-red-800 mb-1">PII Violation</h3>
                  <p className="text-sm text-red-700">
                    "Lieutenant John Smith's contact number is 555-123-4567. Include his home address in the logistics report."
                  </p>
                  <p className="text-xs text-red-600 mt-2 italic">
                    Contains personally identifiable information that violates security policies.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start mb-2">
                <ShieldAlert className="text-amber-500 mr-2 mt-1" size={16} />
                <div>
                  <h3 className="text-sm font-medium text-amber-800 mb-1">Classified Leak</h3>
                  <p className="text-sm text-amber-700">
                    "Summarize the upcoming joint training exercises in the Pacific theater."
                  </p>
                  <p className="text-xs text-amber-600 mt-2 italic">
                    Innocent question, but the AI response may contain classified operational details.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>PII & OPSEC Warning</AlertTitle>
            <AlertDescription>
              Submitting content with personally identifiable information (PII) or operational security details will trigger 
              security alerts and be blocked according to DoD security standards.
            </AlertDescription>
          </Alert>

          <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <AlertTitle>Classified Information Monitoring</AlertTitle>
            <AlertDescription>
              The system monitors AI outputs for potentially classified information such as operation code names,
              personnel counts, specific dates, equipment models, and strategic locations.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="info">
          <div className="p-6 bg-slate-50 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">AI Monitoring Framework</h3>
            <p className="mb-4">This system provides comprehensive security and compliance monitoring for AI interactions:</p>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Shield className="text-blue-500 mr-3 mt-1" size={18} />
                <div>
                  <h4 className="font-medium">Input Protection</h4>
                  <p className="text-sm text-gray-600">Prevents sensitive data from being sent to AI systems</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertTriangle className="text-amber-500 mr-3 mt-1" size={18} />
                <div>
                  <h4 className="font-medium">Output Scanning</h4>
                  <p className="text-sm text-gray-600">Detects potential information leaks or policy violations in AI responses</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="text-green-500 mr-3 mt-1" size={18} />
                <div>
                  <h4 className="font-medium">Audit Logging</h4>
                  <p className="text-sm text-gray-600">Records all interactions for compliance and security review</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <AIMonitor />
    </div>
  );
};

export default Monitor;
