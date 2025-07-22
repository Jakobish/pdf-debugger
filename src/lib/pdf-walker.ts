import * as core from "@hyzyla/pdfjs-core";

type ObjType =
  | core.Ref
  | core.BaseStream
  | core.Dict
  | core.Name
  | ObjType[]
  | StreamContent
  | string
  | number
  | boolean
  | null
  | unknown;

export function isDict(obj: ObjType): obj is core.Dict {
  return core.isDict(obj);
}

export function isRef(obj: ObjType): obj is core.Ref {
  return obj instanceof core.Ref;
}

export function isStream(obj: ObjType): obj is core.BaseStream {
  return obj instanceof core.BaseStream;
}

export function isStreamContent(obj: ObjType): obj is StreamContent {
  return obj instanceof StreamContent;
}

export function isArray(obj: ObjType): obj is ObjType[] {
  return Array.isArray(obj);
}

export function isNumber(obj: ObjType): obj is number {
  return typeof obj === "number";
}

export function isString(obj: ObjType): obj is string {
  return typeof obj === "string";
}

export function isName(obj: ObjType): obj is core.Name {
  return core.isName(obj);
}

export function isBoolean(obj: ObjType): obj is boolean {
  return typeof obj === "boolean";
}

export class StreamContent {
  stream: core.BaseStream;

  constructor(stream: core.BaseStream) {
    this.stream = stream;
  }
}

export class TreeNode<T extends ObjType = ObjType> {
  obj: T;
  name?: string;
  index?: number;
  depth: number;
  ref?: core.Ref;

  visited: boolean = false;
  parent?: TreeNode;
  walker: PDFWalker;
  private _children: TreeNode[] | null = null;
  private _path: string | null = null;

  constructor(options: {
    obj: T;
    name?: string;
    index?: number; // only used for array items
    depth: number;
    ref?: any;
    parent?: TreeNode;
    walker: PDFWalker;
  }) {
    this.obj = options.obj;
    this.name = options.name;
    this.index = options.index;
    this.depth = options.depth;
    this.ref = options.ref;
    this.parent = options.parent;
    this._children = null;
    this.walker = options.walker;
  }

  resolve(xref: any) {
    const fetched = xref.fetch(this.obj);
    this.ref = this.obj as core.Ref;
    this.obj = fetched;
  }

  toObjString(): string {
    const { obj } = this;
    if (isDict(obj)) {
      return `<< ... >>`;
    }
    if (isArray(obj)) {
      return `[ ... ]`;
    }
    if (isStream(obj)) {
      return `stream`;
    }
    if (isStreamContent(obj)) {
      return `stream content`;
    }
    if (isRef(obj)) {
      return `ref(${obj.num}, ${obj.gen})`;
    }
    if (isName(obj)) {
      return `/${obj.name}`;
    }
    if (isNumber(obj)) {
      return `${obj}`;
    }
    if (isString(obj)) {
      return `(${obj})`;
    }
    if (isBoolean(obj)) {
      return `${obj}`;
    }
    return `${obj}`;
  }

  get uniqueId(): string {
    return this.name || this.index?.toString() || "";
  }

  get path(): string {
    if (this._path !== null) {
      return this._path;
    }
    // construct path by traversing up the tree
    const path: string[] = [];
    let node: TreeNode | undefined = this;
    while (node) {
      let part: string = node.name ?? node.index?.toString() ?? "";
      // remove leading slash if present
      if (part.startsWith("/")) {
        part = part.slice(1);
      }
      path.unshift(part);
      node = node.parent;
    }
    this._path = path.join(".");
    return this._path;
  }

  get children(): TreeNode[] {
    // If the children have already been computed, return them.
    if (this._children !== null) {
      return this._children;
    }

    const depth = this.depth + 1;
    const { obj } = this;
    const children: TreeNode[] = [];

    if (isDict(obj)) {
      const keys = obj.getKeys();
      for (const key of keys) {
        const value = obj.getRaw(key);
        children.push(
          new TreeNode({
            obj: value,
            name: key,
            depth,
            parent: this,
            walker: this.walker,
          }),
        );
      }
    } else if (isArray(obj)) {
      for (const [index, value] of obj.entries()) {
        children.push(
          new TreeNode({
            obj: value,
            depth,
            parent: this,
            index: index,
            walker: this.walker,
          }),
        );
      }
    } else if (isStream(obj)) {
      // Stream objects have a dictionary and a stream contents.
      const keys = obj.dict.getKeys();
      for (const key of keys) {
        const value = obj.dict.getRaw(key);
        children.push(
          new TreeNode({
            obj: value,
            name: key,
            depth,
            parent: this,
            walker: this.walker,
          }),
        );
      }
      children.push(
        new TreeNode({
          obj: new StreamContent(obj),
          depth,
          parent: this,
          walker: this.walker,
        }),
      );
    }

    this._children = children;
    for (const child of children) {
      this.walker.resolve(child);
    }
    return children;
  }

  isDict(): this is TreeNode<core.Dict> {
    return isDict(this.obj);
  }

  isRef(): this is TreeNode<core.Ref> {
    return isRef(this.obj);
  }

  isStream(): this is TreeNode<core.BaseStream> {
    return isStream(this.obj);
  }

  isStreamContent(): this is TreeNode<StreamContent> {
    return isStreamContent(this.obj);
  }

  isArray(): this is TreeNode<ObjType[]> {
    return isArray(this.obj);
  }

  isNumber(): this is TreeNode<number> {
    return isNumber(this.obj);
  }

  isString(): this is TreeNode<string> {
    return isString(this.obj);
  }

  isName(): this is TreeNode<core.Name> {
    return isName(this.obj);
  }

  isBoolean(): this is TreeNode<boolean> {
    return isBoolean(this.obj);
  }

  isNull(): this is TreeNode<null> {
    return this.obj === null;
  }

  toJSON(): any {
    const result: any = {
      type: this.getType(),
      path: this.path,
      depth: this.depth,
    };

    if (this.name) result.name = this.name;
    if (this.index !== undefined) result.index = this.index;
    if (this.ref) result.ref = { num: this.ref.num, gen: this.ref.gen };

    if (this.isDict()) {
      result.keys = this.obj.getKeys();
    } else if (this.isArray()) {
      result.length = this.obj.length;
    } else if (this.isRef()) {
      result.value = { num: this.obj.num, gen: this.obj.gen };
    } else if (this.isName()) {
      result.value = this.obj.name;
    } else if (this.isNumber() || this.isString() || this.isBoolean()) {
      result.value = this.obj;
    } else if (this.isNull()) {
      result.value = null;
    } else if (this.isStream()) {
      result.streamInfo = {
        dictKeys: this.obj.dict.getKeys(),
        hasContent: true
      };
    } else if (this.isStreamContent()) {
      result.contentType = "stream-content";
    }

    if (this.children.length > 0) {
      result.children = this.children.map(child => child.toJSON());
    }

    return result;
  }

  private getType(): string {
    if (this.isDict()) return "dict";
    if (this.isArray()) return "array";
    if (this.isRef()) return "ref";
    if (this.isStream()) return "stream";
    if (this.isStreamContent()) return "stream-content";
    if (this.isName()) return "name";
    if (this.isNumber()) return "number";
    if (this.isString()) return "string";
    if (this.isBoolean()) return "boolean";
    if (this.isNull()) return "null";
    return "unknown";
  }
}

/**
 * The PDFWalker class encapsulates the functionality to traverse
 * a PDF's internal structure.
 */
export class PDFWalker {
  pdf: core.PDFDocument;

  xref: any;

  refSet: Set<any> = new Set();

  constructor(options: { pdf: core.PDFDocument }) {
    this.pdf = options.pdf;
    this.xref = this.pdf.xref;
  }

  resolve(node: TreeNode) {
    // If the node is a reference, resolve it.
    if (isRef(node.obj)) {
      const refKey = `${node.obj.num}, ${node.obj.gen}`;
      if (this.refSet.has(refKey)) {
        return;
      }
      node.resolve(this.xref);
      this.refSet.add(refKey);
    }
  }

  /**
   * The 'start' method kicks off the traversal of the PDF structure.
   */
  public start(): TreeNode {
    this.pdf.parseStartXRef();
    this.pdf.parse();

    // Start traversal from the root node, which is the Trailer in the cross-reference table.
    const root = new TreeNode({
      obj: this.xref.trailer,
      name: undefined,
      depth: 0,
      walker: this,
    });

    // Begin the walk.
    this.resolve(root);

    return root;
  }
}
