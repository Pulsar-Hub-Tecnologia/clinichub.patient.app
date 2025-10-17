import { mapAccessLevel } from '@/constants/auth-constants';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ClinicCardProps {
  name: string;
  acesso: string;
  type?: string;
  picture?: string;
}

export function ClinicCard({ name, acesso, type, picture }: ClinicCardProps) {
  const { onLoading, offLoading } = useLoading();

  const navigate = useNavigate();

  async function selectWorkspaces() {
    await onLoading();
    try {
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  }
  return (
    <div className="min-w-[400px] bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
          {picture ? (
            <img src={picture} alt="Foto da clínica" className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <span className="text-primary text-xl font-bold">CN</span>
          )}
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-4">{mapAccessLevel(acesso, type!)}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Espaço de trabalho</span>
          <span className="font-semibold text-gray-800">{type === "BUSINESS" ? "Minha clínica" : "Individual"}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button onClick={() => { selectWorkspaces() }} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors">
          Selecionar Clínica
        </button>
      </div>
    </div>
  )
}