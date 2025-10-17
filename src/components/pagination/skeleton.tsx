import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-gray-200">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="space-y-2">
              <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

interface ErrorStateProps {
  onRetry: () => void
  message?: string
}

export function ErrorState({ onRetry, message = "Erro ao carregar pacientes" }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Oops! Algo deu errado</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}. Verifique sua conexão com a internet e tente novamente.
      </p>
      <Button onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </div>
  )
}

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin mr-2 text-purple-600" />
      {message && (
        <span className="text-gray-600">{message}</span>
      )}
    </div>
  )
}
