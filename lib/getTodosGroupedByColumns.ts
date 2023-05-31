import { databases } from "@/appwrite";

export const getTodosGroupedByColumns = async () => {
  const todos = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!
  );
};
