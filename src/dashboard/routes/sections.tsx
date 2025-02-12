import React, { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('../pages/home'));


// ----------------------------------------------------------------------



export function Router() {
  return useRoutes([
    {
      element: (
        
            <Outlet />
        
      ),
      children: [
        { element: <HomePage />, index: true },
        
      ],
    },
    
  ]);
}
