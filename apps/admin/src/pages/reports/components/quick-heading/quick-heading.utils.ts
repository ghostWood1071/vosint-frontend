import * as _ from "lodash";

// convert text to groupText: "a, b, c" => "("a" + "b" + "c")"
function createGroup(text: string) {
  return (
    "(" +
    text
      .split(",")
      .map((t) => t.trim())
      .map((t) => `"${t}"`)
      .join(" + ") +
    ")"
  );
}

export const queryStringDslTTXVN = ({
  required_keyword,
  exclusion_keyword,
}: {
  required_keyword?: string[];
  exclusion_keyword?: string;
}) => {
  const required = required_keyword?.map(createGroup).join(" | ") ?? "";
  const excluded = exclusion_keyword ? ` - ${createGroup(exclusion_keyword)}` : "";
  return `${required}${excluded}`;
};
