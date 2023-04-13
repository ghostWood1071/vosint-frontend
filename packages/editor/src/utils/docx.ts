import { IS_BOLD, IS_ITALIC, IS_UNDERLINE } from "@/constants/lexical-constant";
import { Document, HeadingLevel, Paragraph, TextRun, UnderlineType } from "docx";

const headingLevel: Record<string, HeadingLevel> = {
  h1: HeadingLevel.HEADING_1,
  h2: HeadingLevel.HEADING_2,
  h3: HeadingLevel.HEADING_3,
  h4: HeadingLevel.HEADING_4,
  h5: HeadingLevel.HEADING_5,
  h6: HeadingLevel.HEADING_6,
};

export function convertLexicalToDocx(lexicalJSON: any) {
  const section: any = {
    properties: {},
    children: [],
  };

  // iterate over blocks in lexicalJSON
  for (const block of lexicalJSON.root.children) {
    // create a new Paragraph for each block
    const paragraph = new Paragraph({
      alignment: block.format,
      children: [],
      indent: block.indent,
    });

    if (block.type === "heading") {
      const text = block?.children[0]?.text;
      const heading = new Paragraph({
        text,
        heading: headingLevel[block.tag],
      });
      section.children.push(heading);
      continue;
    } else if (block.type === "paragraph") {
      // iterae over inline elements in block
      for (const inline of block.children) {
        // create a new TextRun for each inline element
        const textRun = new TextRun({
          text: inline.text,
          bold: !!(inline.format & IS_BOLD),
          italics: !!(inline.format & IS_ITALIC),
          underline:
            inline.format & IS_UNDERLINE
              ? {
                  color: "#000000",
                  type: UnderlineType.SINGLE,
                }
              : undefined,
        });

        paragraph.addChildElement(textRun);
      }

      if (block.children.length === 0) {
        const textRun = new TextRun({});
        paragraph.addChildElement(textRun);
      }
    }
    section.children.push(paragraph);
  }

  return new Document({
    creator: "VOSINT",
    description: "",
    sections: [section],
  });
}
