import { test, expect, describe, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallDisplay } from "../ToolCallDisplay";

afterEach(() => {
  cleanup();
});

// Helper function to create tool invocation mock
function createToolInvocation(
  toolName: string,
  state: "call" | "partial-call" | "result",
  args: any = {},
  result?: any
) {
  return {
    toolName,
    state,
    args,
    result,
  };
}

describe("ToolCallDisplay", () => {
  describe("str_replace_editor tool", () => {
    test("displays creating message for create command", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "create", path: "/src/components/Button.tsx" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Creating Button.tsx")).toBeDefined();
    });

    test("displays viewing message for view command", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "view", path: "/src/utils/helpers.js" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Viewing helpers.js")).toBeDefined();
    });

    test("displays editing message for str_replace command", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "str_replace", path: "/src/App.tsx" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Editing App.tsx")).toBeDefined();
    });

    test("displays adding content message for insert command", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "insert", path: "/src/config.json" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Adding content to config.json")).toBeDefined();
    });

    test("displays reverting changes message for undo_edit command", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "undo_edit", path: "/src/index.html" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Reverting changes to index.html")).toBeDefined();
    });

    test("displays modifying message for unknown command", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "unknown_command", path: "/src/test.js" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Modifying test.js")).toBeDefined();
    });

    test("handles nested file paths correctly", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "create", path: "/very/deeply/nested/path/Component.tsx" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Creating Component.tsx")).toBeDefined();
    });
  });

  describe("file_manager tool", () => {
    test("displays creating message for create command", () => {
      const toolInvocation = createToolInvocation(
        "file_manager",
        "result",
        { command: "create", path: "/docs/README.md" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Creating README.md")).toBeDefined();
    });

    test("displays creating message for create_file command", () => {
      const toolInvocation = createToolInvocation(
        "file_manager",
        "result",
        { command: "create_file", path: "/package.json" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Creating package.json")).toBeDefined();
    });

    test("displays writing message for write command", () => {
      const toolInvocation = createToolInvocation(
        "file_manager",
        "result",
        { command: "write", path: "/src/data.txt" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Writing data.txt")).toBeDefined();
    });

    test("displays reading message for read command", () => {
      const toolInvocation = createToolInvocation(
        "file_manager",
        "result",
        { command: "read", path: "/config/settings.yaml" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Reading settings.yaml")).toBeDefined();
    });

    test("displays listing files message for list command", () => {
      const toolInvocation = createToolInvocation(
        "file_manager",
        "result",
        { command: "list" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Listing files")).toBeDefined();
    });

    test("handles missing path gracefully", () => {
      const toolInvocation = createToolInvocation(
        "file_manager",
        "result",
        { command: "create" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Creating file")).toBeDefined();
    });
  });

  describe("unknown tools", () => {
    test("displays formatted tool name for unknown tools", () => {
      const toolInvocation = createToolInvocation(
        "custom_tool_name",
        "result",
        {}
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Custom Tool Name")).toBeDefined();
    });

    test("handles underscores in tool names", () => {
      const toolInvocation = createToolInvocation(
        "database_migration_tool",
        "result",
        {}
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Database Migration Tool")).toBeDefined();
    });
  });

  describe("tool states", () => {
    test("shows completion indicator for result state", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "create", path: "/test.js" }
      );

      const { container } = render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      // Should have a green completion dot
      const completionDot = container.querySelector(".bg-emerald-500");
      expect(completionDot).toBeDefined();
    });

    test("shows loading indicator for call state", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "call",
        { command: "create", path: "/test.js" }
      );

      const { container } = render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      // Should have a spinning loader
      const loader = container.querySelector(".animate-spin");
      expect(loader).toBeDefined();
    });

    test("shows loading indicator for partial-call state", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "partial-call",
        { command: "create", path: "/test.js" }
      );

      const { container } = render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      // Should have a spinning loader
      const loader = container.querySelector(".animate-spin");
      expect(loader).toBeDefined();
    });
  });

  describe("styling and layout", () => {
    test("applies correct CSS classes", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "create", path: "/test.js" }
      );

      const { container } = render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      const toolDisplay = container.firstChild as HTMLElement;
      expect(toolDisplay.className).toContain("inline-flex");
      expect(toolDisplay.className).toContain("items-center");
      expect(toolDisplay.className).toContain("gap-2");
      expect(toolDisplay.className).toContain("mt-2");
      expect(toolDisplay.className).toContain("px-3");
      expect(toolDisplay.className).toContain("py-1.5");
      expect(toolDisplay.className).toContain("bg-neutral-50");
      expect(toolDisplay.className).toContain("rounded-lg");
      expect(toolDisplay.className).toContain("text-xs");
      expect(toolDisplay.className).toContain("border");
      expect(toolDisplay.className).toContain("border-neutral-200");
    });

    test("displays appropriate icon for file operations", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: "create", path: "/NewFile.tsx" }
      );

      const { container } = render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      // Should have an icon (SVG element)
      const icon = container.querySelector("svg");
      expect(icon).toBeDefined();
    });
  });

  describe("edge cases", () => {
    test("handles empty args object", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        {}
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      // Should not crash and should display a fallback message
      expect(screen.getByText("Modifying file")).toBeDefined();
    });

    test("handles null or undefined command", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { command: null, path: "/test.js" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Modifying test.js")).toBeDefined();
    });

    test("handles missing command field", () => {
      const toolInvocation = createToolInvocation(
        "str_replace_editor",
        "result",
        { path: "/test.js" }
      );

      render(<ToolCallDisplay toolInvocation={toolInvocation} />);

      expect(screen.getByText("Modifying test.js")).toBeDefined();
    });
  });
});