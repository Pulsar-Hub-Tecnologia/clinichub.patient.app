import { useState, useEffect, useRef } from 'react';
import { CookieController, PatientCookieName } from '@/services/cookies/cookie-controller';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AccountService from '@/services/api/account.service';
import ConsultationService from '@/services/api/consultation.service';
import { UpcomingConsultationModal } from '@/components/modal/upcoming-consultation-modal';

export default function PrivateRoute() {
  const token = CookieController.get(PatientCookieName.TOKEN);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastConsultationIdRef = useRef<string | null>(null);

  const { data: account, isLoading } = useQuery({
    queryKey: ['account'],
    queryFn: AccountService.getAccount,
    enabled: !!token,
    retry: false,
  });

  const { data: upcomingConsultation } = useQuery({
    queryKey: ['upcoming-consultation'],
    queryFn: ConsultationService.getUpcomingConsultation,
    enabled: !!token && !!account,
    refetchInterval: 60000, // 1 minute
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (upcomingConsultation && upcomingConsultation.id !== lastConsultationIdRef.current) {
      setIsModalOpen(true);
      lastConsultationIdRef.current = upcomingConsultation.id;
    }
  }, [upcomingConsultation]);

  const handleJoin = () => {
    setIsModalOpen(false);
    if (upcomingConsultation) {
      navigate(`/consultations/${upcomingConsultation.id}`);
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se o usuário precisa de onboarding e não está na página de welcome
  if (account && !account.has_onboarding && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace />;
  }

  // Se o usuário já fez onboarding e tenta acessar a página de welcome
  if (account && account.has_onboarding && location.pathname === '/welcome') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Outlet />
      <UpcomingConsultationModal
        consultation={upcomingConsultation || null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJoin={handleJoin}
      />
    </>
  );
}
