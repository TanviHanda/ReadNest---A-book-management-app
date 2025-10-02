"use server";

import { utapi } from "../utapi";

export const deleteUTFileAction = async (fileKey: string) => {
  if (!fileKey) return false;
  try {
    // utapi.deleteFiles may throw on failure — surface that to caller via boolean
    await utapi.deleteFiles([fileKey]);
    return true;
  } catch (err) {
    // You may want to log the error server-side; returning false keeps client-side simple
    console.error("deleteUTFileAction error:", err);
    return false;
  }
};
