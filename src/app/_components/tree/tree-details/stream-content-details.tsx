import Image from "next/image";
import { MdFileDownload } from "react-icons/md";

import { DetailProps } from "@/app/_components/tree/tree-details/_types";
import { Button } from "@/components/button";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { StreamContent } from "@/lib/pdf-walker";
import {
  frmoByteArrayToUnicode,
  fromByteArrayToBase64,
  fromByteArrayToHexString,
} from "@/lib/utils";

function ImagePreview({ bytes }: { bytes: Uint8Array }) {
  const blob = new Blob([bytes], { type: "image/jpeg" });
  const url = URL.createObjectURL(blob);

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Image Preview:</h4>
      <Image
        src={url}
        alt="PDF embedded image"
        width={0}
        height={0}
        sizes="100vw"
        className="max-w-full max-h-64 rounded border shadow-sm w-auto h-auto"
        onLoad={() => URL.revokeObjectURL(url)}
      />
    </div>
  );
}

function TrueTypeContext({ node }: DetailProps<StreamContent>) {
  const onDownloadClick = () => {
    const stream = node.obj.stream;
    stream.reset();
    const bytes = stream.getBytes();
    const blob = new Blob([bytes], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "font.ttf";
    link.click();
  };

  return (
    <>
      <h3>Context</h3>
      <p>
        It&apos;s a TrueType font file. Currently, we don&apos;t support
        rendering content of TrueType font files. You can download it and open
        it in your favorite font editor.
      </p>
      <Button onClick={onDownloadClick} className="flex flex-row gap-2">
        <MdFileDownload />
        Download
      </Button>
    </>
  );
}

/**
 * If we recognize type of the stream, we can provide more context
 * like showing a font file or image
 */
function Context({ node }: DetailProps<StreamContent>) {
  const path = node.path;
  const stream = node.obj.stream;
  stream.reset();
  let bytes = stream.getBytes();

  // Check if it's a JPEG image
  if (
    stream.constructor.name === "JpegStream" ||
    (bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8)
  ) {
    if (stream.constructor.name === "JpegStream") {
      // @ts-ignore
      bytes = stream.bytes;
    }
    return <ImagePreview bytes={bytes} />;
  }

  if (path.endsWith(".FontFile2.")) {
    return <TrueTypeContext node={node} />;
  }

  return null;
}

export function StreamContentDetails({ node }: DetailProps<StreamContent>) {
  const stream = node.obj.stream;
  stream.reset();

  let bytes = stream.getBytes();
  if (stream.constructor.name === "JpegStream") {
    // @ts-ignore
    bytes = stream.bytes;
  }

  return (
    <>
      <h1>Stream Content</h1>
      <p>It&apos;s an actual content of a stream</p>
      {node.index !== undefined && (
        <>
          <h3>Index</h3>
          <pre>{node.index}</pre>
        </>
      )}
      <Context node={node} />
      <h3>Content</h3>
      <Tabs defaultValue="unicode">
        <TabsList>
          <TabsTrigger value="unicode">Unicode</TabsTrigger>
          <TabsTrigger value="base64">Base64</TabsTrigger>
          <TabsTrigger value="hex">Hex</TabsTrigger>
        </TabsList>
        <TabsContent value="unicode">
          <CodeBlock code={frmoByteArrayToUnicode(bytes)} language="text" />
        </TabsContent>
        <TabsContent value="base64">
          <CodeBlock code={fromByteArrayToBase64(bytes)} language="text" />
        </TabsContent>
        <TabsContent value="hex">
          <CodeBlock code={fromByteArrayToHexString(bytes)} language="text" />
        </TabsContent>
      </Tabs>
      <h3>Path</h3>
      <pre>{node.path}</pre>
    </>
  );
}
