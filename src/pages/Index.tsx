
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';
import { useMonitoring } from '@/contexts/MonitoringContext';
import MetricsCard from '@/components/dashboard/MetricsCard';
import RiskGauge from '@/components/dashboard/RiskGauge';
import TrendChart from '@/components/dashboard/TrendChart';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { metrics, incidents, isLoading } = useMonitoring();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Recent incidents
  const recentIncidents = incidents
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Interactions"
          value={metrics?.totalInteractions || 0}
          icon={<Activity className="h-5 w-5" />}
          variant="default"
        />
        <MetricsCard
          title="Blocked Interactions"
          value={metrics?.blockedInteractions || 0}
          icon={<Shield className="h-5 w-5" />}
          variant="danger"
        />
        <MetricsCard
          title="Open Incidents"
          value={metrics?.openIncidents || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <MetricsCard
          title="Resolved Incidents"
          value={metrics?.resolvedIncidents || 0}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart 
            data={metrics?.violationsTrend || []} 
            title="Policy Violations (Last 30 Days)" 
            color="#e74c3c"
          />
        </div>
        <div>
          <RiskGauge value={metrics?.riskScore || 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Recent Incidents</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">ID</th>
                  <th className="text-left pb-2">Time</th>
                  <th className="text-left pb-2">Rule</th>
                  <th className="text-left pb-2">Severity</th>
                  <th className="text-left pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentIncidents.length > 0 ? (
                  recentIncidents.map((incident) => (
                    <tr key={incident.id} className="border-b">
                      <td className="py-3 pr-4">{incident.id.slice(0, 10)}...</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          {new Date(incident.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 pr-4">{incident.rule.name}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          incident.status === 'open' ? 'bg-red-100 text-red-800' :
                          incident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                          incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No recent incidents
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
