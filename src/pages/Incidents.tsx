
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMonitoring } from '@/contexts/MonitoringContext';

const Incidents = () => {
  const { incidents, updateIncidentStatus } = useMonitoring();
  const [filter, setFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'open' | 'investigating' | 'resolved' | 'false-positive'>('resolved');

  // Filter incidents based on the selected filter
  const filteredIncidents = incidents.filter(incident => {
    switch (filter) {
      case 'open':
        return incident.status === 'open';
      case 'investigating':
        return incident.status === 'investigating';
      case 'resolved':
        return incident.status === 'resolved';
      case 'false-positive':
        return incident.status === 'false-positive';
      case 'critical':
        return incident.severity === 'critical';
      case 'high':
        return incident.severity === 'high';
      default:
        return true;
    }
  });
  
  // Sort incidents by timestamp (newest first)
  const sortedIncidents = [...filteredIncidents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Handle status update
  const handleStatusUpdate = () => {
    if (selectedIncident && newStatus) {
      updateIncidentStatus(selectedIncident, newStatus, notes);
      setSelectedIncident(null);
      setNotes('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Incidents</h1>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:w-64">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter incidents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Incidents</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="false-positive">False Positive</SelectItem>
              <SelectItem value="critical">Critical Severity</SelectItem>
              <SelectItem value="high">High Severity</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          {sortedIncidents.length} incidents found
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Security Incidents</CardTitle>
          <CardDescription>
            Policy violations detected by the monitoring system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedIncidents.length > 0 ? (
                sortedIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">
                      {incident.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {new Date(incident.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{incident.rule.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {incident.severity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        incident.status === 'open' ? 'bg-red-100 text-red-800' :
                        incident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                        incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {incident.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedIncident(incident.id)}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Incident Details</DialogTitle>
                            <DialogDescription>
                              View and update the incident information
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Incident ID</Label>
                                <Input value={incident.id} readOnly />
                              </div>
                              <div>
                                <Label>Date & Time</Label>
                                <Input value={new Date(incident.timestamp).toLocaleString()} readOnly />
                              </div>
                            </div>
                            
                            <div>
                              <Label>Rule</Label>
                              <Input value={incident.rule.name} readOnly />
                            </div>
                            
                            <div>
                              <Label>Content</Label>
                              <Textarea value={incident.content} readOnly className="h-20" />
                            </div>
                            
                            <div>
                              <Label>Status</Label>
                              <Select 
                                defaultValue={incident.status} 
                                onValueChange={(value) => setNewStatus(value as any)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="investigating">Investigating</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="false-positive">False Positive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Notes</Label>
                              <Textarea 
                                placeholder="Add resolution notes..." 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedIncident(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleStatusUpdate}>
                              Update Status
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No incidents found matching the selected filter
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Incidents;
