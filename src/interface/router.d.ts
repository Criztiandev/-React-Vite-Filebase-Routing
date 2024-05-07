/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PageModule {
  default: React.ComponentType<any>;
  loader?: () => Promise<any>;
  action?: () => void;
  ErrorBoundary?: React.ComponentType<any>;
}

interface RouteModule {
  path: string;
  Element: React.ComponentType<any>;
  loader?: () => Promise<any>;
  action?: () => void;
  ErrorBoundary?: any;
}
