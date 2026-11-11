import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "News post",
  type: "document",
  fields: [
    defineField({
      name: "locale",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "繁體中文", value: "zh-tw" },
          { title: "日本語", value: "ja" },
          { title: "Tiếng Việt", value: "vi" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "locale" },
  },
});
