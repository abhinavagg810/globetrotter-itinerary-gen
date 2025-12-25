import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Server, Clock, Database } from 'lucide-react';
import { checkApiHealth, testAuthEndpoint, HealthCheckResult } from '@/services/healthCheck';
import { getApiBaseUrl } from '@/services/api';

export function ApiHealthCheck() {
  const [healthResult, setHealthResult] = useState<HealthCheckResult | null>(null);
  const [authStatus, setAuthStatus] = useState<{ available: boolean; message: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const [health, auth] = await Promise.all([
        checkApiHealth(),
        testAuthEndpoint(),
      ]);
      setHealthResult(health);
      setAuthStatus(auth);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: HealthCheckResult['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unhealthy':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: HealthCheckResult['status']) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'unhealthy':
        return <Badge className="bg-yellow-100 text-yellow-800">Unhealthy</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          API Health Check
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={runHealthCheck}
          disabled={isChecking}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API URL */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">API URL</p>
          <code className="text-sm font-mono break-all">{getApiBaseUrl()}</code>
        </div>

        {/* Health Status */}
        {healthResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(healthResult.status)}
                <span className="font-medium">API Status</span>
              </div>
              {getStatusBadge(healthResult.status)}
            </div>

            <p className="text-sm text-muted-foreground">{healthResult.message}</p>

            {healthResult.responseTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Response time: {healthResult.responseTime}ms
              </div>
            )}

            {healthResult.details?.database && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Database className="w-4 h-4" />
                Database connected
              </div>
            )}
          </div>
        )}

        {/* Auth Endpoint Status */}
        {authStatus && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auth Endpoints</span>
              {authStatus.available ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">Unavailable</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{authStatus.message}</p>
          </div>
        )}

        {/* Configuration Help */}
        {healthResult?.status === 'error' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-800 mb-2">Connection Failed</p>
            <p className="text-xs text-amber-700 mb-2">
              Make sure your Spring Boot backend is running at the configured URL.
            </p>
            <p className="text-xs text-amber-700">
              To configure: Set <code className="bg-amber-100 px-1 rounded">VITE_API_URL</code> in your environment or update <code className="bg-amber-100 px-1 rounded">src/services/api.ts</code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
