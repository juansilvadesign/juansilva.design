import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const stackIdSchema = z.enum([
  "typescript",
  "javascript",
  "tailwind",
  "figma",
  "python",
  "opensource",
]);

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}(?:-\d{2})?$/, "Use YYYY-MM or YYYY-MM-DD");

const hrefSchema = z.string().min(1).refine(
  (value) => value.startsWith("/") || URL.canParse(value),
  "Use an absolute URL or a root-relative path",
);

const localizedProjectCopySchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    previewAlt: z.string().trim().min(1),
    liveLabel: z.string().trim().min(1),
    evidenceLabel: z.string().trim().min(1),
  })
  .strict();

export const projectSchema = z
  .object({
    title: z.string().trim().min(1),
    role: z.string().trim().min(1),
    attribution: z.string().trim().min(1),
    dates: z
      .object({
        start: dateSchema,
        end: dateSchema.nullable(),
      })
      .strict(),
    stack: z.array(stackIdSchema).min(1),
    impact: z.string().trim().min(1),
    liveUrl: hrefSchema,
    evidenceLink: hrefSchema,
    featured: z.boolean(),
    preview: hrefSchema,
    copy: z
      .object({
        en: localizedProjectCopySchema,
        pt: localizedProjectCopySchema,
      })
      .strict(),
  })
  .strict();

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/projects",
  }),
  schema: projectSchema,
});

export const collections = { projects };

export type ProjectData = z.infer<typeof projectSchema>;
