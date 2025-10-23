import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useTheme } from '@/context/theme-context.tsx';

import PrivateRoute from './private.routes.tsx';
import PublicRoutes from './public.routes.tsx';

import { SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar.tsx';
import SidebarHeader from '@/components/app-sidebar/app-sidebar-trigger.tsx';

import Login from '@/pages/public/login.tsx';
import ForgotPassword from '@/pages/public/forgot-password.tsx';
import RecoverPassword from '@/pages/public/recover-password.tsx';
import RegisterAccess from '@/pages/public/register-access.tsx';
import RegisterInfo from '@/pages/public/register-info.tsx';
import VerifyEmail from '@/pages/public/verify-email.tsx';
import ValidateEmail from '@/pages/public/validate-email.tsx';

import Dashboard from '@/pages/private/dashboard.tsx';
import Account from '@/pages/private/account.tsx';
import MyInvites from '@/pages/private/my-invites.tsx';
import Consultations from '@/pages/private/consultations.tsx';
import VideoCall from '@/pages/private/video-call.tsx';

export const AppRoute = () => {
  const { theme } = useTheme();

  return (
    <>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register-access' element={<RegisterAccess />} />
            <Route path='/register-info' element={<RegisterInfo />} />
            <Route path='/verify-email' element={<VerifyEmail />} />
            <Route path='/validate-email/:token/:email' element={<ValidateEmail />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/recover/:token/:email' element={<RecoverPassword />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route
              path='/dashboard'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <Dashboard />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/account'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <Account />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/meus-convites'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <MyInvites />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/consultas'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <Consultations />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/consultas/:consultationId/video-call'
              element={<VideoCall />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
};
