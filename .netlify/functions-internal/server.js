var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// server.js
import { createRequestHandler } from "@netlify/remix-adapter";

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {};
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  mode: () => mode,
  publicPath: () => publicPath,
  routes: () => routes
});

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links
});
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

// app/styles/style.css
var style_default = "/build/_assets/style-DQTJ2DJZ.css";

// app/root.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var links = () => [
  ...void 0 ? [
    { rel: "stylesheet", href: void 0 },
    { rel: "stylesheet", href: style_default }
  ] : [{ rel: "stylesheet", href: style_default }]
];
function App() {
  return /* @__PURE__ */ jsxs("html", { suppressHydrationWarning: !0, lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { suppressHydrationWarning: !0, children: [
      /* @__PURE__ */ jsx2(Outlet, {}),
      /* @__PURE__ */ jsx2(ScrollRestoration, {}),
      /* @__PURE__ */ jsx2(Scripts, {}),
      /* @__PURE__ */ jsx2(LiveReload, {})
    ] })
  ] });
}

// app/routes/api.tasks.tsx
var api_tasks_exports = {};
__export(api_tasks_exports, {
  loader: () => loader
});

// app/utils/db.tsx
import { PrismaClient } from "@prisma/client";
var db;
db = new PrismaClient();

// app/routes/api.tasks.tsx
var loader = async ({ request }) => {
  let url = new URL(request.url), assignee = url.searchParams.get("assignee");
  return console.log("FFF", url.searchParams.has("assignee")), console.log("ETF: ", assignee), await db.task.findMany({
    where: {
      assignee: String(assignee)
      // due_date: {
      //   gte: today,
      //   lte: tomorrow,
      // },
    }
  });
};

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  loader: () => loader2
});
import { redirect } from "@remix-run/node";
var loader2 = () => redirect("/tasks");

// app/routes/tasks.tsx
var tasks_exports = {};
__export(tasks_exports, {
  action: () => action,
  default: () => Page,
  getTasksStringByDate: () => getTasksStringByDate,
  loader: () => loader3,
  meta: () => meta
});
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { useState, useEffect, createRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var getTasksStringByDate = async (assignee, { today, tomorrow }) => (await db.task.findMany({
  where: {
    assignee: String(assignee),
    due_date: {
      gte: today,
      lte: tomorrow
    }
  }
})).map((t) => `${t.assignee}, ${t.description}, ${t.due_date}, ${t.id}`).join(`
`), action = async ({ request }) => {
  let formData = await request.formData(), intent = formData.get("intent"), assignee = formData.get("assignee");
  if (intent === "today") {
    let today = /* @__PURE__ */ new Date("2023-10-01"), tomorrow = new Date(today);
    return tomorrow.setDate(tomorrow.getDate() + 1), getTasksStringByDate(assignee, { today, tomorrow });
  }
  if (intent === "tomorrow") {
    let today = /* @__PURE__ */ new Date("2023-10-02"), tomorrow = new Date(today);
    return tomorrow.setDate(tomorrow.getDate() + 1), getTasksStringByDate(assignee, { today, tomorrow });
  }
  if (intent === "next-week") {
    let today = /* @__PURE__ */ new Date("2023-10-01");
    today.setDate(today.getDate() + 7);
    let tomorrow = new Date(today);
    return tomorrow.setDate(tomorrow.getDate() + 7), getTasksStringByDate(assignee, { today, tomorrow });
  }
  return null;
}, meta = () => [
  { title: "DevSavant Challenge" },
  { name: "description", content: "by blissmo" }
], loader3 = async ({ request }) => {
  let tasks = await db.task.findMany();
  return { users: [...new Set(tasks.map((t) => t.assignee))], tasks };
};
function Page() {
  let { users, tasks } = useLoaderData(), [activeUser, setActive] = useState(), filtered = activeUser ? tasks.filter((t) => t.assignee === activeUser) : tasks;
  return /* @__PURE__ */ jsxs2("main", { className: "bg-brand-800 min-h-screen text-white bg px-6", children: [
    /* @__PURE__ */ jsx3(
      Filters,
      {
        onSelect: (name) => setActive(name),
        activeUser,
        users,
        children: activeUser && /* @__PURE__ */ jsx3(ExportUtil, { assignee: activeUser })
      }
    ),
    /* @__PURE__ */ jsx3(Table, { tasks: filtered })
  ] });
}
var ExportUtil = ({ assignee }) => {
  let [downloadable, set] = useState(!1), containerRef = createRef(), fetcher = useFetcher();
  useEffect(() => {
    fetcher.data && typeof fetcher.data == "string" && set(!0);
  }, [fetcher]), useEffect(() => {
    set(!1);
  }, [assignee]);
  let downloadFile = () => {
    if (!fetcher.data)
      return;
    let link = document.createElement("a"), blob = new Blob([fetcher.data], { type: "text/plain" });
    link.download = "tasks.csv", link.href = window.URL.createObjectURL(blob), link.click();
  };
  return /* @__PURE__ */ jsxs2("div", { ref: containerRef, className: "flex gap-4", children: [
    downloadable ? /* @__PURE__ */ jsxs2(Fragment, { children: [
      /* @__PURE__ */ jsx3(
        Link,
        {
          reloadDocument: !0,
          to: `/api/tasks?assignee=${assignee}`,
          className: "underline",
          children: "Open Json"
        }
      ),
      /* @__PURE__ */ jsx3("button", { className: "underline", onClick: downloadFile, children: "Download CSV" })
    ] }) : /* @__PURE__ */ jsx3("button", { className: "", children: "Export:" }),
    assignee && /* @__PURE__ */ jsx3(Fragment, { children: downloadable ? null : /* @__PURE__ */ jsx3(fetcher.Form, { method: "post", children: /* @__PURE__ */ jsxs2("div", { className: "rounded-lg w-60 h-20 bg-brand-700 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsx3("input", { name: "assignee", type: "hidden", value: assignee }),
      /* @__PURE__ */ jsx3(
        "button",
        {
          name: "intent",
          value: "today",
          type: "submit",
          className: "hover:text-brand-500",
          children: "Today"
        }
      ),
      /* @__PURE__ */ jsx3(
        "button",
        {
          name: "intent",
          value: "tomorrow",
          type: "submit",
          className: "hover:text-brand-500",
          children: "Tomorrow"
        }
      ),
      /* @__PURE__ */ jsx3(
        "button",
        {
          name: "intent",
          value: "next-week",
          type: "submit",
          className: "hover:text-brand-500",
          children: "Next week"
        }
      )
    ] }) }) })
  ] });
}, Table = ({ tasks }) => /* @__PURE__ */ jsxs2(AnimatePresence, { children: [
  /* @__PURE__ */ jsxs2("div", { className: "grid grid-cols-4 text-brand-500 p-2", children: [
    /* @__PURE__ */ jsx3("p", { children: "Id" }),
    /* @__PURE__ */ jsx3("p", { children: "Description" }),
    /* @__PURE__ */ jsx3("p", { children: "Assignee" }),
    /* @__PURE__ */ jsx3("p", { children: "Due date" })
  ] }),
  tasks.map((task, i) => /* @__PURE__ */ jsxs2(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.3 },
      className: twMerge(
        "grid grid-cols-4 p-2",
        i % 2 === 0 && "bg-brand-700"
      ),
      children: [
        /* @__PURE__ */ jsx3("p", { children: task.uid }),
        /* @__PURE__ */ jsx3("p", { children: task.description }),
        /* @__PURE__ */ jsx3("p", { children: task.assignee }),
        /* @__PURE__ */ jsx3("p", { children: new Date(task.due_date).toLocaleString("en-US", {
          dateStyle: "medium"
        }) })
      ]
    },
    task.id
  ))
] }), Filters = ({
  users,
  activeUser,
  onSelect,
  children
}) => /* @__PURE__ */ jsxs2("nav", { className: "gap-4 flex items-center justify-center py-6 mb-6 border-b", children: [
  users.map((name) => /* @__PURE__ */ jsx3(
    "button",
    {
      type: "button",
      onClick: () => onSelect(name),
      className: twMerge(
        " py-2 px-4 rounded-lg transition-all hover:opacity-70",
        activeUser === name && "text-brand-500 bg-brand-700"
      ),
      children: name
    },
    name
  )),
  /* @__PURE__ */ jsx3("section", { className: "ml-auto mr-12", children })
] });

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-N5KL6U45.js", imports: ["/build/_shared/chunk-QIOLCOXH.js", "/build/_shared/chunk-G5WX4PPA.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-QZV4LKRP.js", imports: void 0, hasAction: !1, hasLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-IOYLXKHS.js", imports: void 0, hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 }, "routes/api.tasks": { id: "routes/api.tasks", parentId: "root", path: "api/tasks", index: void 0, caseSensitive: void 0, module: "/build/routes/api.tasks-23VIMXLC.js", imports: void 0, hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 }, "routes/tasks": { id: "routes/tasks", parentId: "root", path: "tasks", index: void 0, caseSensitive: void 0, module: "/build/routes/tasks-SGWSWUTQ.js", imports: void 0, hasAction: !0, hasLoader: !0, hasErrorBoundary: !1 } }, version: "99c99f7a", hmr: void 0, url: "/build/manifest-99C99F7A.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public/build", future = {}, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/api.tasks": {
    id: "routes/api.tasks",
    parentId: "root",
    path: "api/tasks",
    index: void 0,
    caseSensitive: void 0,
    module: api_tasks_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/tasks": {
    id: "routes/tasks",
    parentId: "root",
    path: "tasks",
    index: void 0,
    caseSensitive: void 0,
    module: tasks_exports
  }
};

// server.js
var handler = createRequestHandler({
  build: server_build_exports,
  mode: "production"
});
export {
  handler
};
