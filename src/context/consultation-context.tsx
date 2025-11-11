import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";

export type ConsultationType = "PRESENCIAL" | "ONLINE";

export type ConsultationStatus =
  | "CONFIRMED"
  | "PENDING"
  | "CANCELED"
  | "COMPLETED";

export interface Workspace {
  id: string;
  name: string;
  picture?: string | null;
  type: "PERSONAL" | "BUSINESS";
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
  phone?: string | null;
  especiality?: string | null;
  regional_council_number?: string | null;
  bio?: string | null;
}

export interface ConsultationData {
  workspace?: Workspace;
  professional?: Professional;
  consultationType?: ConsultationType;
  scheduledDate?: Date;
  scheduledTime?: string;
  duration?: number;
}

interface ConsultationContextInterface {
  consultationData: ConsultationData;
  setWorkspace: (workspace: Workspace) => void;
  setProfessional: (professional: Professional) => void;
  setSchedule: (date: Date, time: string, duration: number) => void;
  setConsultationType: (type: ConsultationType) => void;
  clearConsultation: () => void;
  isWorkspaceSelected: boolean;
  isProfessionalSelected: boolean;
  isScheduleSelected: boolean;
}

const ConsultationContext = createContext<
  ConsultationContextInterface | undefined
>(undefined);

interface ConsultationProviderInterface {
  children: ReactNode;
}

export const ConsultationProvider = ({
  children,
}: ConsultationProviderInterface) => {
  const [consultationData, setConsultationData] = useState<ConsultationData>(
    {},
  );

  const setWorkspace = useCallback((workspace: Workspace) => {
    setConsultationData((prev) => ({
      ...prev,
      workspace,
    }));
  }, []);

  const setProfessional = useCallback((professional: Professional) => {
    setConsultationData((prev) => ({
      ...prev,
      professional,
    }));
  }, []);

  const setSchedule = useCallback(
    (date: Date, time: string, duration: number) => {
      setConsultationData((prev) => ({
        ...prev,
        scheduledDate: date,
        scheduledTime: time,
        duration,
      }));
    },
    [],
  );

  const setConsultationType = useCallback((type: ConsultationType) => {
    setConsultationData((prev) => ({
      ...prev,
      consultationType: type,
    }));
  }, []);

  const clearConsultation = useCallback(() => {
    setConsultationData({});
  }, []);

  const isWorkspaceSelected = !!consultationData.workspace;
  const isProfessionalSelected = !!consultationData.professional;
  const isScheduleSelected =
    !!consultationData.scheduledDate &&
    !!consultationData.scheduledTime &&
    !!consultationData.duration;

  return (
    <ConsultationContext.Provider
      value={{
        consultationData,
        setWorkspace,
        setProfessional,
        setSchedule,
        setConsultationType,
        clearConsultation,
        isWorkspaceSelected,
        isProfessionalSelected,
        isScheduleSelected,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error(
      "useConsultation must be used within a ConsultationProvider",
    );
  }
  return context;
};

export default ConsultationContext;
