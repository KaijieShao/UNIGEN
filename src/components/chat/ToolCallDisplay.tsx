import { Loader2, FileText, FilePlus, FileEdit, Eye, Undo2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: "call" | "partial-call" | "result";
  args: any;
  result?: any;
}

interface ToolCallDisplayProps {
  toolInvocation: ToolInvocation;
}

function getFileDisplayName(path: string | undefined): string {
  if (!path || typeof path !== "string") return "file";
  return path.split("/").pop() || path;
}

function getStrReplaceEditorMessage(args: any): { icon: React.ComponentType<any>; message: string } {
  const { command, path } = args;
  const fileName = getFileDisplayName(path);

  switch (command) {
    case "create":
      return {
        icon: FilePlus,
        message: `Creating ${fileName}`,
      };
    case "view":
      return {
        icon: Eye,
        message: `Viewing ${fileName}`,
      };
    case "str_replace":
      return {
        icon: FileEdit,
        message: `Editing ${fileName}`,
      };
    case "insert":
      return {
        icon: FileEdit,
        message: `Adding content to ${fileName}`,
      };
    case "undo_edit":
      return {
        icon: Undo2,
        message: `Reverting changes to ${fileName}`,
      };
    default:
      return {
        icon: FileText,
        message: `Modifying ${fileName}`,
      };
  }
}

function getFileManagerMessage(args: any): { icon: React.ComponentType<any>; message: string } {
  const { command, path } = args;
  const fileName = path ? getFileDisplayName(path) : "file";

  switch (command) {
    case "create":
    case "create_file":
      return {
        icon: FilePlus,
        message: `Creating ${fileName}`,
      };
    case "write":
    case "write_file":
      return {
        icon: FileEdit,
        message: `Writing ${fileName}`,
      };
    case "read":
    case "read_file":
      return {
        icon: Eye,
        message: `Reading ${fileName}`,
      };
    case "list":
    case "list_files":
      return {
        icon: FileText,
        message: `Listing files`,
      };
    default:
      return {
        icon: FileText,
        message: `Managing ${fileName}`,
      };
  }
}

function getToolMessage(toolName: string, args: any): { icon: React.ComponentType<any>; message: string } {
  switch (toolName) {
    case "str_replace_editor":
      return getStrReplaceEditorMessage(args);
    case "file_manager":
      return getFileManagerMessage(args);
    default:
      return {
        icon: FileText,
        message: toolName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      };
  }
}

export function ToolCallDisplay({ toolInvocation }: ToolCallDisplayProps) {
  const { toolName, state, args } = toolInvocation;
  const { icon: Icon, message } = getToolMessage(toolName, args);

  const isCompleted = state === "result";
  const isLoading = state === "call" || state === "partial-call";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isCompleted ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <Icon className="w-3 h-3 text-neutral-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      ) : isLoading ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <Icon className="w-3 h-3 text-neutral-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Icon className="w-3 h-3 text-neutral-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}