import * as core from "@hyzyla/pdfjs-core";

import { DetailProps } from "@/app/_components/tree/tree-details/_types";

export function RefDetails({ node }: DetailProps<core.Ref>) {
  const ref = `${node.obj.num} ${node.obj.gen} R`;
  const syntax = node.name ? `/${node.name} ${ref}` : `[... ${ref} ...]`;
  return (
    <>
      <h1>Reference</h1>
      <p>
        It&apos;s a reference to an indirect object in the PDF file (like a
        link)
      </p>
      <h3>PDF Syntax:</h3>
      <pre>{syntax}</pre>
      {node.index !== undefined && (
        <>
          <h3>Index:</h3>
          <pre>{node.index}</pre>
        </>
      )}
      <h3>Value:</h3>
      <pre>{ref}</pre>
      <button
        onClick={() => {
          const element = document.getElementById(
            `ref-${node.obj.num}-${node.obj.gen}`,
          );
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("bg-yellow-200", "dark:bg-yellow-800");
            element.classList.add("bg-opacity-100");
            setTimeout(() => {
              element.classList.remove("bg-yellow-200", "dark:bg-yellow-800");
              element.classList.add("bg-opacity-0");
            }, 2000);
          }
        }}
        className="text-blue-500 hover:underline"
      >
        Go to Reference
      </button>
      <h3>Path:</h3>
      <pre>{node.path}</pre>
    </>
  );
}
