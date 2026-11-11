import { defineField, defineType } from "sanity";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      type: "slug",
      validation: (r) => r.required(),
    }),
    defineField({ name: "updated", type: "date" }),
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
      name: "body",
      title: "Body (portable text by locale)",
      type: "object",
      fields: [
        { name: "en", type: "array", of: [{ type: "block" }] },
        { name: "zhTw", type: "array", of: [{ type: "block" }] },
        { name: "ja", type: "array", of: [{ type: "block" }] },
        { name: "vi", type: "array", of: [{ type: "block" }] },
      ],
    }),
  ],
});
