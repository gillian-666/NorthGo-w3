import { defineField, defineType } from "sanity";

export const office = defineType({
  name: "office",
  title: "Office",
  type: "document",
  fields: [
    defineField({ name: "officeId", title: "Office ID", type: "string", validation: (r) => r.required() }),
    defineField({ name: "hq", title: "Head office", type: "boolean", initialValue: false }),
    defineField({
      name: "regions",
      title: "Regions",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Taiwan", value: "taiwan" },
          { title: "Japan", value: "japan" },
          { title: "Southeast Asia", value: "sea" },
          { title: "Americas", value: "americas" },
          { title: "Asia-Pacific", value: "apac" },
        ],
      },
    }),
    defineField({ name: "lat", title: "Latitude", type: "number", validation: (r) => r.required() }),
    defineField({ name: "lng", title: "Longitude", type: "number", validation: (r) => r.required() }),
    defineField({ name: "tel", type: "string" }),
    defineField({ name: "fax", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({
      name: "names",
      title: "Names by locale",
      type: "object",
      fields: [
        { name: "en", type: "string", title: "EN" },
        { name: "zhTw", type: "string", title: "ZH-TW" },
        { name: "ja", type: "string", title: "JA" },
        { name: "vi", type: "string", title: "VI" },
      ],
    }),
    defineField({
      name: "addresses",
      title: "Addresses by locale",
      type: "object",
      fields: [
        { name: "en", type: "text", title: "EN" },
        { name: "zhTw", type: "text", title: "ZH-TW" },
        { name: "ja", type: "text", title: "JA" },
        { name: "vi", type: "text", title: "VI" },
      ],
    }),
  ],
  preview: {
    select: { title: "names.en", subtitle: "email" },
  },
});
