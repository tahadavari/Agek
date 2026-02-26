import { KanbanBoard } from "@/components/kanban-board";
import { Card } from "@/components/ui/card";
import { listTasks } from "@/lib/store";

export default function Page() {
  const tasks = listTasks();

  return (
    <main className="mx-auto min-h-screen max-w-7xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Agek Agentic Kanban</h1>
        <p className="text-slate-600">Modern board to schedule, assign, and run tasks on CLI-based AI agents.</p>
      </header>

      <Card className="p-4">
        <h2 className="text-lg font-medium">Board</h2>
        <p className="mb-4 text-sm text-slate-600">Drag tasks across columns to update status.</p>
        <KanbanBoard initialTasks={tasks} />
      </Card>
    </main>
  );
}
