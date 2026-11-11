import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Marketing page",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Page key",
      type: "string",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "About", value: "about" },
          { title: "Contact", value: "contact" },
          { title: "Locations", value: "locations" },
          { title: "News", value: "news" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "seo",
      type: "object",
      fields: [
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
          name: "description",
          type: "object",
          fields: [
            { name: "en", type: "text" },
            { name: "zhTw", type: "text" },
            { name: "ja", type: "text" },
            { name: "vi", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "blocks",
      title: "Content blocks",
      type: "array",
      of: [
        {
          type: "object",
          name: "richText",
          fields: [
            { name: "heading", type: "string" },
            {
              name: "body",
              type: "object",
              fields: [
                { name: "en", type: "array", of: [{ type: "block" }] },
                { name: "zhTw", type: "array", of: [{ type: "block" }] },
                { name: "ja", type: "array", of: [{ type: "block" }] },
                { name: "vi", type: "array", of: [{ type: "block" }] },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
