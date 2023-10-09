export const saveFromJSONToDB = async () => {
  const tasks = (
    await (await fetch("http://localhost:3000/tasks.json")).json()
  ).map((t) => ({
    description: t.description,
    due_date: t.due_date,
    assignee: t.assignee,
    uid: t.id,
  }));
  const dbTasks = await db.task.createMany({ data: tasks });
  return dbTasks;
};
