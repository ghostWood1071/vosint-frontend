import { IEventDTO } from "@/models/event.type";
import { IQuickHeading } from "@/pages/reports/components/quick-heading";
import { queryStringDslTTXVN } from "@/pages/reports/components/quick-heading/quick-heading.utils";
import { getEvent } from "@/services/event.service";
import { getNewsFromTTXVN } from "@/services/job.service";
import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Paragraph,
  TextRun,
  UnderlineType,
} from "docx";
import moment from "moment";
import { QueryClient, useQueryClient } from "react-query";

import { IS_BOLD, IS_ITALIC, IS_UNDERLINE } from "../constants/lexical-constant";
import { filterIsBetween } from "../plugins/events-plugin/events-components";

const headingLevel: Record<number, HeadingLevel> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

export async function convertLexicalToDocx(
  lexicalJSON: any,
  queryClient: QueryClient,
  dateTime: [string, string],
  title: string,
) {
  const section: any = {
    properties: {},
    children: [],
  };

  // for title and datetime
  const titleDocx = new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
  });

  const dateTimeDocx = new Paragraph({
    text: `Từ ngày: ${dateTime[0]} đến ngày ${dateTime[1]}`,
    alignment: AlignmentType.CENTER,
  });

  section.children.push(titleDocx);
  section.children.push(dateTimeDocx);

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
      // iterate over inline elements in block
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

export function useConvertLexicalToDocx() {
  const queryClient = useQueryClient();
  return (lexicalJSON: any, dateTime: [string, string], title: string) => {
    return convertLexicalToDocx(lexicalJSON, queryClient, dateTime, title);
  };
}

export async function convertHeadingsToDocx({
  headings,
  queryClient,
  dateTime,
  title,
}: {
  headings: IQuickHeading[];
  queryClient: QueryClient;
  dateTime: [string, string];
  title: string;
}) {
  const section: any = {
    properties: {},
    children: [],
  };

  // for title and datetime
  const titleDocx = new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
  });

  const dateTimeDocx = new Paragraph({
    text: `Từ ngày: ${dateTime[0]} đến ngày ${dateTime[1]}`,
    alignment: AlignmentType.CENTER,
  });

  section.children.push(titleDocx);
  section.children.push(dateTimeDocx);

  for (const heading of headings) {
    const headingDocx = new Paragraph({
      text: heading.title,
      heading: headingLevel[heading.level],
    });
    section.children.push(headingDocx);

    if (heading.ttxvn) {
      const paragraph = new Paragraph({
        children: [],
      });
      const params = {
        text_search: queryStringDslTTXVN({
          required_keyword: heading.required_keyword,
          exclusion_keyword: heading.exclusion_keyword,
        }),
        startDate: dateTime[0],
        endDate: dateTime[1],
      };
      var events = queryClient.getQueryData<any>(["NEWS_TTXVN", params]);
      if (!events) {
        try {
          events = await queryClient.fetchQuery<IEventDTO>({
            queryKey: ["NEWS_TTXVN", params],
            queryFn: () => getNewsFromTTXVN(params),
          });
        } catch {}
      }
      events?.result?.forEach((event: any) => {
        const name = new TextRun({
          text: event.Title,
          bold: true,
        });

        const time = new TextRun({
          text: `Thời gian: ${
            event.PublishDate ? moment(event.PublishDate).format("DD/MM/YYYY") : ""
          }`,
          break: 1,
        });
        const content = new TextRun({
          text: event.content,
          break: 1,
        });

        paragraph.addChildElement(name);
        paragraph.addChildElement(time);
        paragraph.addChildElement(content);
      });
      // section.children.push(paragraph);
    } else {
      for (const event_id of heading?.eventIds) {
        var event = queryClient.getQueryData<IEventDTO>(["event", event_id]);
        if (!event) {
          try {
            event = await queryClient.fetchQuery<IEventDTO>({
              queryKey: ["event", event_id],
              queryFn: () => getEvent(event_id),
            });
          } catch {
            event = {};
          }
        }

        if (
          dateTime[0] &&
          dateTime[1] &&
          !filterIsBetween(event?.date_created ?? null, dateTime[0], dateTime[1])
        ) {
          continue;
        }

        const name = new TextRun({
          text: event.event_name,
          bold: true,
        });

        const time = new TextRun({
          text: `Thời gian: ${
            event.date_created ? moment(event.date_created).format("DD/MM/YYYY") : ""
          }`,
          break: 1,
        });

        const paragraph = new Paragraph({
          children: [],
        });
        paragraph.addChildElement(name);
        paragraph.addChildElement(time);
        section.children.push(paragraph);

        // iterate over blocks in lexicalJSON
        try {
          const lexicalContent = JSON.parse(event?.event_content ?? "{}");
          for (const block of lexicalContent.root?.children) {
            const paragraph = new Paragraph({
              children: [],
            });
            if (block.type === "heading") {
              const text = block?.children[0]?.text;
              const heading = new Paragraph({
                text,
                heading: headingLevel[block.tag],
              });
              section.children.push(heading);
            } else if (block.type === "paragraph") {
              for (const inline of block.children) {
                const textRun = new TextRun({
                  text: block?.children[0]?.text,
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
        } catch {
          const paragraph = new Paragraph({
            children: [],
          });
          const content = new TextRun({
            text: event.event_content,
          });
          paragraph.addChildElement(content);
          section.children.push(paragraph);
        }

        if (Array.isArray(event.new_list) && event.new_list.length > 0) {
          const paragraph = new Paragraph({
            children: [],
          });
          const title = new TextRun({
            text: "Danh sách tin nói về sự kiện:",
            break: 1,
          });

          paragraph.addChildElement(title);

          event.new_list.forEach((newItem) => {
            const newTitle = new ExternalHyperlink({
              children: [
                new TextRun({
                  text: newItem["data:title"],
                  break: 1,
                  style: "Hyperlink",
                }),
              ],
              link: newItem["data:url"],
            });
            paragraph.addChildElement(newTitle);
          });

          section.children.push(paragraph);
        }

        const newLine = new Paragraph({
          children: [],
        });
        newLine.addChildElement(new TextRun({ break: 1 }));
        section.children.push(newLine);
      }
    }
  }

  return new Document({
    creator: "VOSINT",
    description: "",
    sections: [section],
  });
}

export function useConvertHeadingsToDocx() {
  const queryClient = useQueryClient();
  return ({
    headings,
    dateTime,
    title,
  }: {
    headings: IQuickHeading[];
    dateTime: [string, string];
    title: string;
  }) => {
    return convertHeadingsToDocx({ headings, queryClient, dateTime, title });
  };
}
