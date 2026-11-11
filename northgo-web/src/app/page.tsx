import { redirect } from "next/navigation";

/** Static hosting has no next-intl middleware; send `/` to the zh-tw site. */
export default function RootPage() {
  redirect("/zh-tw");
}
