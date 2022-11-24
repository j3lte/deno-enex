import { TurdownService } from "../deps.ts";

const service = new TurdownService();

type Node = {
  tagName: string;
  _attrsByQName: Record<string, {
    localName: string;
    data?: string;
  }>;
};

const mediaNodeToMarkdown = (node: Node) => {
  const { _attrsByQName } = node;
  const { hash, type, width, style, height } = _attrsByQName;
  const obj: Record<string, string> = {};
  [hash, type, width, style, height].forEach((attr) => {
    if (attr && attr.data) {
      obj[attr.localName] = attr.data;
    }
  });

  return `> OBJECT: ${JSON.stringify(obj)}`;
};

service.addRule("en-media", {
  filter: (node: Node) => {
    console.log(node.tagName);
    return node.tagName === "EN-MEDIA";
  },
  replacement: (_content: string, node: Node) => {
    return mediaNodeToMarkdown(node);
  },
});

export const parseContentAsMarkdown = (contentXML: string): string => {
  const cleaned = contentXML
    .replace(/<br clear="none"\/>/g, "<br />\n")
    .replace(/^(.*)<br \/>\n/gm, "<p>$1</p>\n")
    .replace(/<en-media/gm, "\n\n<en-media")
    .replace(/><\/en-media>/gm, " /><br />\n");
  // const dom = parseDocument(cleaned);
  // const content = selectAll("en-note > *", dom);
  // const html = render(content, { xmlMode: false });
  const markdown = service.turndown(cleaned);

  // console.log(`==============\n\n`, cleaned, "\n\n==============");
  // console.log(`==============\n\n`, markdown, "\n\n==============");

  return markdown;
};
