import config from "@/config";
import {visionTool} from "@sanity/vision";
import {pages} from "@tinloof/sanity-studio";
import {defineConfig, isDev} from "sanity";
import {structureTool} from "sanity/structure";
import {imageHotspotArrayPlugin} from "sanity-plugin-hotspot-array";
import {simplerColorInput} from "sanity-plugin-simpler-color-input";

import {StudioLogo} from "./components/studio/logo";
import schemas from "./sanity/schemas";
import {
  defaultDocumentNode,
  disableCreationDocumentTypes,
  structure,
} from "./sanity/schemas/structure";
import {
  singletonActions,
  singletonsTypes,
} from "./sanity/schemas/structure/singletons";

export default defineConfig({
  basePath: config.sanity.studioUrl,
  dataset: config.sanity.dataset,
  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) =>
      singletonsTypes.has(context.schemaType)
        ? input.filter(({action}) =>
            !isDev && action ? singletonActions.has(action) : true,
          )
        : input,
  },
  icon: StudioLogo,
  plugins: [
    simplerColorInput({
      // Note: These are all optional
      defaultColorFormat: "rgba",
      defaultColorList: [
        {label: "Light", value: "#ffffff"},
        {label: "Dark", value: "#333333"},
        {label: "Brand", value: "#ca786d"},
        {label: "Accent", value: "#626754"},
        {label: "Custom...", value: "custom"},
      ],
      enableSearch: true,
    }),
    pages({
      creatablePages: ["modular.page", "text.page"],
      previewUrl: {
        previewMode: {
          enable: "/api/draft",
        },
      },
    }),
    structureTool({
      defaultDocumentNode,
      structure,
      title: "General",
    }),
    visionTool({defaultApiVersion: config.sanity.apiVersion}),
    imageHotspotArrayPlugin(),
  ],
  projectId: config.sanity.projectId,
  schema: {
    templates: (templates) =>
      templates?.filter(
        (template) =>
          !disableCreationDocumentTypes?.includes(template.schemaType),
      ),
    types: schemas,
  },
  title: config.siteName,
});
