import { ClinicCard } from "@/components/workspace/clinic-card";
import { useAuth } from "@/context/auth-context";

export default function Workspaces() {
  const { accesses } = useAuth();

  const isSingle = accesses.length === 1;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Selecione o workspace</h1>
        <p className="text-base text-muted-foreground">
          Escolha em qual clínica irá trabalhar
        </p>
      </div>
      <section
        className={`w-full max-w-5xl grid gap-8 ${isSingle
            ? "grid-cols-1 justify-center place-items-center"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          }`}
      >
        {accesses.map((workspace) => (
          <ClinicCard
            key={workspace.workspace_id}
            name={workspace.name}
            acesso={workspace.role}
            type={workspace.type}
            picture={workspace.picture}
          />
        ))}
      </section>
    </main>
  );
}
