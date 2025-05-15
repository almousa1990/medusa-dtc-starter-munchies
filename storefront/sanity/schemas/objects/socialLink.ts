import {defineType} from "sanity";

import {link} from "./link";

export const socialLink = defineType({
  fields: [
    {
      name: "label",
      title: "Button label",
      type: "string",
    },
    {
      name: "link",
      type: "link",
      validation: (Rule) =>
        Rule.custom((value, {parent}) => {
          if ((parent as any)?.label) {
            return value ? true : "Required";
          }
          return true;
        }),
    },
    {
      name: "icon",
      title: "Icon",
      type: "string",
    },
  ],
  icon: link.icon,
  name: "socialLink",
  title: "Social Link",
  type: "object",
});
