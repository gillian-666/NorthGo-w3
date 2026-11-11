import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      type: "object",
      fields: [
        { name: "en", type: "string" },
        { name: "zhTw", type: "string" },
        { name: "ja", type: "string" },
        { name: "vi", type: "string" },
      ],
    }),
    defineField({
      name: "metaDescription",
      type: "object",
      fields: [
        { name: "en", type: "text" },
        { name: "zhTw", type: "text" },
        { name: "ja", type: "text" },
        { name: "vi", type: "text" },
      ],
    }),
    defineField({
      name: "hero",
      type: "object",
      fields: [
        { name: "en", type: "text" },
        { name: "zhTw", type: "text" },
        { name: "ja", type: "text" },
        { name: "vi", type: "text" },
      ],
    }),
    defineField({
      name: "intro",
      type: "object",
      fields: [
        { name: "en", type: "text" },
        { name: "zhTw", type: "text" },
        { name: "ja", type: "text" },
        { name: "vi", type: "text" },
      ],
    }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "id", type: "string" },
            {
              name: "title",
              type: "object",
              fields: [
                { name: "en", type: "string" },
                { name: "zhTw", type: "string" },
                { name: "ja", type: "string" },
                { name: "vi", type: "string" },
              ],
            },
            {
              name: "body",
              type: "object",
              fields: [
                { name: "en", type: "text" },
                { name: "zhTw", type: "text" },
                { name: "ja", type: "text" },
                { name: "vi", type: "text" },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
