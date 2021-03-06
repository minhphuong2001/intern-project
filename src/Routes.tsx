import React, { lazy, Suspense } from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { ROUTES } from './configs/routes';
import AuthRoute from './modules/common/components/AuthRoute';
import ProtectedRoute from './modules/common/components/ProtectedRoute';

const HomePage = lazy(() => import('./modules/home/pages/HomePage'));
const ContactPage = lazy(() => import('./modules/home/pages/ContactPage'));
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('./modules/auth/pages/RegisterPage'));
const TodoPage = lazy(() => import('./modules/home/pages/TodoPage'));
const ProfilePage = lazy(() => import('./modules/home/pages/ProfilePage'));
const PayrollPage = lazy(() => import('./modules/home/pages/PayrollPage'));
const TodoDetailPage = lazy(() => import('./modules/home/pages/TodoDetailPage'));

export const Routes = () => {
  const location = useLocation();

  return (
    <Suspense
      fallback={<div style={{ height: '100vh' }} className="d-flex justify-content-center align-items-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden"></span>
      </div>
    </div>}
    >
      <Switch location={location}>
        <AuthRoute path={ROUTES.login} component={LoginPage} />
        <ProtectedRoute path={ROUTES.home} component={HomePage} />
        <ProtectedRoute path={`${ROUTES.todo}/:id`} component={TodoDetailPage} />
        <ProtectedRoute path={ROUTES.todo} component={TodoPage} />
        <ProtectedRoute path={ROUTES.profile} component={ProfilePage} />
        <ProtectedRoute path={ROUTES.contact} component={ContactPage} />
        <ProtectedRoute path={ROUTES.payroll} component={PayrollPage} />
        <AuthRoute path={ROUTES.register} component={RegisterPage} />

        <AuthRoute path="/" component={LoginPage} />
      </Switch>
    </Suspense>
  );
};
