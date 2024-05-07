/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

interface PageModule {
  default: React.ComponentType<any>;
  loader?: () => Promise<any>;
  action?: () => void;
  ErrorBoundary?: React.ComponentType<{
    children: React.ReactNode;
    error: any;
  }>;
}

interface RouteModule {
  path: string;
  Element: React.ComponentType<any>;
  loader?: () => Promise<any>;
  action?: () => void;
  ErrorBoundary?: any;
}

function FileBaseRouterProvider(): JSX.Element {
  const pages: Record<string, PageModule> = import.meta.glob(
    "./pages/**/*.tsx",
    { eager: true }
  );

  if (Object.values(pages).length <= 0) {
    throw new Error("Root folder is not specified");
  }

  const routes: Array<RouteModule> = [];

  for (const path of Object.keys(pages)) {
    const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];

    if (!fileName) {
      continue;
    }

    const normalizePathName: string = fileName
      .replace(/\(([^)]+)\)/g, "")
      .replace(/\[([^\]]+)\]/g, ":$1")
      .replace(/\/index$/, "");

    const fileMap: Record<string, string> = {
      index: "/",
      notfound: "*",
    };

    routes.push({
      path: fileMap[fileName] || `/${normalizePathName.toLowerCase()}`,
      Element: pages[path].default,
      loader: pages[path]?.loader,
      action: pages[path]?.action,
      ErrorBoundary: pages[path]?.ErrorBoundary,
    });
  }

  const createdRouter = createBrowserRouter(
    routes.map(({ Element, ErrorBoundary, ...rest }) => ({
      ...rest,
      element: <Element />,
      ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
    }))
  );

  return <RouterProvider router={createdRouter} />;
}

export default FileBaseRouterProvider;
