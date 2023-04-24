import { CACHE_KEYS } from "@/pages/reports/report.loader";
import { IEventDto, TReportEventsDto } from "@/services/report-type";
import { getEvent, getReportEvents } from "@/services/report.service";
import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Paragraph,
  TextRun,
  UnderlineType,
} from "docx";
import { QueryClient, useQueryClient } from "react-query";

import { IS_BOLD, IS_ITALIC, IS_UNDERLINE } from "../constants/lexical-constant";
import { filterIsBetween } from "../plugins/events-plugin/events-components";

const headingLevel: Record<string, HeadingLevel> = {
  h1: HeadingLevel.HEADING_1,
  h2: HeadingLevel.HEADING_2,
  h3: HeadingLevel.HEADING_3,
  h4: HeadingLevel.HEADING_4,
  h5: HeadingLevel.HEADING_5,
  h6: HeadingLevel.HEADING_6,
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
    } else if (block.type === "events") {
      var events = queryClient.getQueryData<TReportEventsDto>([CACHE_KEYS.REPORT_EVENT, block.id]);

      if (!events) {
        events = await queryClient.fetchQuery<TReportEventsDto>({
          queryKey: [CACHE_KEYS.REPORT_EVENT, block.id],
          queryFn: () => getReportEvents(block.id),
        });
      }

      events?.event_ids?.forEach(async (event_id) => {
        var event = queryClient.getQueryData<IEventDto>(["event", event_id]);
        if (!event) {
          event = await queryClient.fetchQuery<IEventDto>({
            queryKey: ["event", event_id],
            queryFn: () => getEvent(event_id),
          });
        }

        if (
          dateTime[0] &&
          dateTime[1] &&
          !filterIsBetween(event?.date_created ?? null, dateTime[0], dateTime[1])
        ) {
          return;
        }

        const name = new TextRun({
          text: event.event_name,
          bold: true,
        });

        const time = new TextRun({
          text: `Thời gian: ${event.date_created}`,
          break: 1,
        });

        const content = new TextRun({
          text: event.event_content,
          italics: true,
          break: 1,
        });

        paragraph.addChildElement(name);
        paragraph.addChildElement(time);
        paragraph.addChildElement(content);

        if (Array.isArray(event.new_list) && event.new_list.length > 0) {
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
        }
        paragraph.addChildElement(new TextRun({ break: 1 }));
      });
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
