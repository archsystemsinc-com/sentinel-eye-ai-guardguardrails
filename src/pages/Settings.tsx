
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Enable Real-time Monitoring</Label>
                      <p className="text-sm text-gray-500">
                        Validate all AI interactions in real-time
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Auto-block Violations</Label>
                      <p className="text-sm text-gray-500">
                        Automatically block interactions that violate critical rules
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Data Retention</Label>
                      <p className="text-sm text-gray-500">
                        Keep interaction history for compliance
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Retention Period</Label>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Send email notifications for critical incidents
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Slack Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Send alerts to a Slack channel
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Daily Reports</Label>
                      <p className="text-sm text-gray-500">
                        Receive daily summary reports
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Recipients</Label>
                    <Textarea 
                      placeholder="Enter email addresses (one per line)" 
                      defaultValue="admin@example.com&#10;security@example.com"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Configure external system integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex">
                      <Input 
                        type="password" 
                        value="sk_live_example_key_123456789abcdef" 
                        className="rounded-r-none"
                        readOnly
                      />
                      <Button variant="outline" className="rounded-l-none">
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use this key to authenticate API requests to the monitoring system
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input 
                      placeholder="https://your-service.com/webhook" 
                      defaultValue="https://alerts.example.com/sentinel-webhook"
                    />
                    <p className="text-xs text-gray-500">
                      We'll send incident notifications to this URL
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">SIEM Integration</Label>
                      <p className="text-sm text-gray-500">
                        Send log data to your Security Information and Event Management system
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced system behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Custom Rule Engine</Label>
                    <Select defaultValue="regex">
                      <SelectTrigger>
                        <SelectValue placeholder="Select engine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regex">Regex-based</SelectItem>
                        <SelectItem value="ml">ML-powered</SelectItem>
                        <SelectItem value="hybrid">Hybrid approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Debug Mode</Label>
                      <p className="text-sm text-gray-500">
                        Enable detailed logging for troubleshooting
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Content Redaction</Label>
                      <p className="text-sm text-gray-500">
                        Automatically redact sensitive data in logs
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Performance Mode</Label>
                      <p className="text-sm text-gray-500">
                        Optimize for performance over comprehensive logging
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
