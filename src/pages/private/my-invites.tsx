import { WorkspaceList } from "@/components/workspace/workspace-list";

export default function MyInvitesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-6 gap-5">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Minhas Clínicas</h1>
            <p className="text-sm text-gray-500">
              Gerencie suas clínicas e convites pendentes
            </p>
          </div>
        </div>
      </section>

      <WorkspaceList />
    </div>
  );
}
