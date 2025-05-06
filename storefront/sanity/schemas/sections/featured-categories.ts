import {defineField} from "sanity";

export default defineField({
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    },

    {
      name: "cards",
      of: [
        {
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "cta",
              title: "Call to action",
              type: "cta",
              validation: (Rule) => Rule.required(),
            },
          ],
          name: "categoryCard",
          preview: {
            select: {
              title: "cta.label",
            },
          },
          title: "Category Card",
          type: "object",
        },
      ],
      title: "Cards",
      type: "array",
    },
    {
      name: "cta",
      title: "CTA",
      type: "cta",
    },
  ],
  name: "section.featuredCategories",
  preview: {
    prepare: ({title}) => ({
      subtitle: "Featured categories section",
      title,
    }),
    select: {
      title: "title",
    },
  },
  title: "Featured categories section",
  type: "object",
});
