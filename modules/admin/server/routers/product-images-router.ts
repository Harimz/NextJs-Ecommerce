import { z } from "zod";
import { createTRPCRouter, adminProtectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { createPresignedPutUrl, deleteR2Object } from "@/lib/r2";

const fileInput = z.object({
  name: z.string(),
  type: z.string(), // mime
  size: z.number(),
});

export const productImagesRouter = createTRPCRouter({
  getUploadUrls: adminProtectedProcedure
    .input(z.object({ files: z.array(fileInput).max(10) }))
    .mutation(async ({ input }) => {
      // basic validation
      for (const f of input.files) {
        if (!f.type.startsWith("image/")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only images allowed",
          });
        }
        if (f.size > 10 * 1024 * 1024) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Max 10MB per image",
          });
        }
      }

      const results = await Promise.all(
        input.files.map(async (f) => {
          const ext = f.name.split(".").pop()?.toLowerCase() ?? "jpg";
          const id = crypto.randomUUID();
          const key = `products/temp/${id}.${ext}`;

          const { uploadUrl, publicUrl } = await createPresignedPutUrl({
            key,
            contentType: f.type,
          });

          return { key, uploadUrl, publicUrl };
        }),
      );

      return { uploads: results };
    }),

  delete: adminProtectedProcedure
    .input(z.object({ key: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await deleteR2Object(input.key);
      return { ok: true };
    }),
});
