import {defineField, defineType} from "sanity";

export default defineType({
  fields: [
    defineField({
      name: "product",
      to: [{type: "product"}],
      type: "reference",
      weak: true,
    }),
    defineField({
      fieldset: "position",
      initialValue: 50,
      name: "x",
      readOnly: true,
      type: "number",
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      fieldset: "position",
      initialValue: 50,
      name: "y",
      readOnly: true,
      type: "number",
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
  ],
  fieldsets: [
    {
      name: "position",
      options: {columns: 2},
    },
  ],
  name: "spot",
  preview: {
    select: {
      title: "product.internalTitle",
    },
  },
  title: "Product Hotspot",
  type: "object",
});
