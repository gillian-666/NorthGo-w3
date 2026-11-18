import { handleEnquirePost } from "@/server/enquire-handler";

export async function POST(request: Request) {
  return handleEnquirePost(request);
}
