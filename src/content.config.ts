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

/**
 * Stamp written by the evidence store's exporter.
 *
 * These files are DERIVED. The source of truth is the private store in the
 * notes repo (`_config/portfolio/records/`), which holds the full corpus
 * across every showability tier; only records marked showable are exported
 * here. Edit the record and re-run the exporter — an edit made in this
 * directory is overwritten on the next run and, worse, is a claim that never
 * passed the store's attribution check.
 */
const generatedSchema = z
  .object({
    by: z.string().trim().min(1),
    from: z.string().trim().min(1),
    note: z.string().trim().min(1),
  })
  .strict();

export const projectSchema = z
  .object({
    _generated: generatedSchema.optional(),
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
