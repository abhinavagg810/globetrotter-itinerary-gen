import { getApiBaseUrl } from './api';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'error';
  message: string;
  apiUrl: string;
  responseTime?: number;
  details?: {
    database?: boolean;
    timestamp?: string;
  };
}

export async function checkApiHealth(): Promise<HealthCheckResult> {
  const apiUrl = getApiBaseUrl();
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        status: 'healthy',
        message: 'Spring Boot API is running',
        apiUrl,
        responseTime,
        details: {
          database: data.database || true,
          timestamp: data.timestamp || new Date().toISOString(),
        },
      };
    } else {
      return {
        status: 'unhealthy',
        message: `API returned status ${response.status}`,
        apiUrl,
        responseTime,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error 
        ? `Cannot connect to API: ${error.message}` 
        : 'Cannot connect to Spring Boot API',
      apiUrl,
    };
  }
}

// Test basic auth endpoints
export async function testAuthEndpoint(): Promise<{
  available: boolean;
  message: string;
}> {
  const apiUrl = getApiBaseUrl();
  
  try {
    // Try to hit the auth endpoint (will fail without credentials, but should return 401 not network error)
    const response = await fetch(`${apiUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 401 means the endpoint exists but needs auth - that's good!
    if (response.status === 401 || response.status === 403) {
      return {
        available: true,
        message: 'Auth endpoints are available',
      };
    }
    
    return {
      available: true,
      message: `Auth endpoint responded with status ${response.status}`,
    };
  } catch {
    return {
      available: false,
      message: 'Cannot reach auth endpoints',
    };
  }
}
