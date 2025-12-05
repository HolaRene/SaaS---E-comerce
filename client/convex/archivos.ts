import { mutation } from "./_generated/server";
 
export const generateUploadUrl = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
   
 
    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});