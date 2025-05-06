import definePage from "@/sanity/helpers/define-page";
import {defineField} from "sanity";

export default definePage({
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      hidden: true,
      name: "internalTitle",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "thumbnail",
      options: {
        hotspot: true,
      },
      title: "Thumbnail",
      type: "image",
    }),
    // Add more custom fields here if needed
  ],
  name: "category",
  options: {
    disableCreation: true, // Prevent creation of new documents
  },
  preview: {
    select: {
      media: "thumbnail",
      title: "internalTitle",
    },
  },
  title: "Category",
  type: "document",
});
