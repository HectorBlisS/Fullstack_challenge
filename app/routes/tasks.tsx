import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { db } from "~/utils/db";
import { twMerge } from "tailwind-merge";
import { type ReactNode, useState, useEffect, createRef } from "react";
import type { Task } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

// @TODO: move to utils
export const getTasksStringByDate = async (
  assignee: string,
  { today, tomorrow }: { today: Date; tomorrow: Date }
) => {
  const tasks = await db.task.findMany({
    where: {
      assignee: String(assignee),
      due_date: {
        gte: today,
        lte: tomorrow,
      },
    },
  });
  return tasks
    .map((t) => `${t.assignee}, ${t.description}, ${t.due_date}, ${t.id}`)
    .join("\n");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const assignee = formData.get("assignee");

  // @TODO: validate assignee is coming and Zod.
  if (intent === "today") {
    const today = new Date("2023-10-01");
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getTasksStringByDate(assignee as string, { today, tomorrow });
  }
  if (intent === "tomorrow") {
    const today = new Date("2023-10-02");
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getTasksStringByDate(assignee as string, { today, tomorrow });
  }
  if (intent === "next-week") {
    const today = new Date("2023-10-01");
    today.setDate(today.getDate() + 7);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 7);
    return getTasksStringByDate(assignee as string, { today, tomorrow });
  }
  return null;
};

export const meta = () => {
  return [
    { title: "DevSavant Challenge" },
    { name: "description", content: "by blissmo" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tasks = await db.task.findMany();
  const users = [...new Set(tasks.map((t) => t.assignee))];
  return { users, tasks };
};

export default function Page() {
  const { users, tasks } = useLoaderData<typeof loader>();
  const [activeUser, setActive] = useState<string>();

  const filtered = activeUser
    ? tasks.filter((t) => t.assignee === activeUser)
    : tasks;

  return (
    <main className="bg-brand-800 min-h-screen text-white bg px-6">
      <Filters
        onSelect={(name) => setActive(name)}
        activeUser={activeUser}
        users={users}
      >
        {activeUser && <ExportUtil assignee={activeUser} />}
      </Filters>
      <Table tasks={filtered} />
    </main>
  );
}

const ExportUtil = ({ assignee }: { assignee: string }) => {
  const [downloadable, set] = useState(false);
  const containerRef = createRef<HTMLDivElement>();
  const fetcher = useFetcher();
  //   useEffect(() => {
  //     const handler = (event: MouseEvent) => {
  //       if (active) {
  //         if (!containerRef?.current?.contains(event.target as Node)) {
  //           set(false);
  //         }
  //       }
  //     };
  //     document.addEventListener("click", handler);
  //     return () => document.removeEventListener("click", handler);
  //     /* eslint-disable */
  //   }, []);

  useEffect(() => {
    if (fetcher.data && typeof fetcher.data === "string") {
      set(true);
    }
  }, [fetcher]);
  useEffect(() => {
    set(false);
  }, [assignee]);

  const downloadFile = () => {
    if (!fetcher.data) return;
    const link = document.createElement("a");
    const blob = new Blob([fetcher.data], { type: "text/plain" });
    link.download = "tasks.csv";
    link.href = window.URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div ref={containerRef} className="flex gap-4">
      {downloadable ? (
        <>
          <Link
            reloadDocument
            to={`/api/tasks?assignee=${assignee}`}
            className="underline"
            // onClick={downloadFile}
          >
            Open Json
          </Link>
          <button className="underline" onClick={downloadFile}>
            Download CSV
          </button>
        </>
      ) : (
        <button className="">Export:</button>
      )}
      {assignee && (
        <>
          {downloadable ? null : (
            <fetcher.Form method="post">
              <div className="rounded-lg w-60 h-20 bg-brand-700 flex items-center justify-center gap-2">
                <input name="assignee" type="hidden" value={assignee} />
                <button
                  name="intent"
                  value="today"
                  type="submit"
                  className="hover:text-brand-500"
                >
                  Today
                </button>

                <button
                  name="intent"
                  value="tomorrow"
                  type="submit"
                  className="hover:text-brand-500"
                >
                  Tomorrow
                </button>

                <button
                  name="intent"
                  value="next-week"
                  type="submit"
                  className="hover:text-brand-500"
                >
                  Next week
                </button>
              </div>
            </fetcher.Form>
          )}
        </>
      )}
    </div>
  );
};

const Table = ({ tasks }: { tasks: Task[] }) => {
  return (
    <AnimatePresence>
      <div className="grid grid-cols-4 text-brand-500 p-2">
        <p>Id</p>
        <p>Description</p>
        <p>Assignee</p>
        <p>Due date</p>
      </div>
      {tasks.map((task, i) => {
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ y: 0, opacity: 1 }}
            // exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={twMerge(
              "grid grid-cols-4 p-2",
              i % 2 === 0 && "bg-brand-700"
            )}
            key={task.id}
          >
            <p>{task.uid}</p>
            <p>{task.description}</p>
            <p>{task.assignee}</p>
            <p>
              {new Date(task.due_date).toLocaleString("en-US", {
                dateStyle: "medium",
              })}
            </p>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

const Filters = ({
  users,
  activeUser,
  onSelect,
  children,
}: {
  children: ReactNode;
  onSelect: (arg0: string) => void;
  activeUser?: string;
  users: string[];
}) => {
  return (
    <nav className="gap-4 flex items-center justify-center py-6 mb-6 border-b">
      {users.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          className={twMerge(
            " py-2 px-4 rounded-lg transition-all hover:opacity-70",
            activeUser === name && "text-brand-500 bg-brand-700"
          )}
        >
          {name}
        </button>
      ))}
      <section className="ml-auto mr-12">{children}</section>
    </nav>
  );
};
