import { db } from "~/utils/db";
import { type ActionFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const assignee = url.searchParams.get("assignee");
  console.log("FFF", url.searchParams.has("assignee"));
  // const intent = url.searchParams.get("intent");
  // if (intent === "today") { // @TODO add multiple options [today,tomorrow,etc.]
  // const today = new Date("2023-10-01");
  // const tomorrow = new Date(today);
  console.log("ETF: ", assignee);
  const tasks = await db.task.findMany({
    where: {
      assignee: String(assignee),
      // due_date: {
      //   gte: today,
      //   lte: tomorrow,
      // },
    },
  });

  return tasks;
  // }
};
