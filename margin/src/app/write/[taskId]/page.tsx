import { notFound } from "next/navigation";
import { TASK_MAP } from "@/lib/tasks";
import { Studio } from "@/components/Studio";

export function generateStaticParams() {
  return Object.keys(TASK_MAP).map((taskId) => ({ taskId }));
}

export default function WritePage({ params }: { params: { taskId: string } }) {
  const task = TASK_MAP[params.taskId];
  if (!task) notFound();
  return <Studio task={task} />;
}
