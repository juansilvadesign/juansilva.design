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
    /** One line for the compact /projects grid card. */
    tagline: z.string().trim().min(1),
    /** The longer form, for the homepage showcase and the case-study intro. */
    description: z.string().trim().min(1),
    previewAlt: z.string().trim().min(1),
    liveLabel: z.string().trim().min(1),
    /** Present only alongside `evidenceLink`. */
    evidenceLabel: z.string().trim().min(1).optional(),
  })
  .strict();

/**
 * The rich body of a case study, in authored order.
 *
 * Mirrors `validateCaseStudyBlocks` in `_config/portfolio/schema.mjs` — the two
 * are halves of one release and must change together, or the store will accept
 * a record the site cannot render.
 *
 * `image.src` is deliberately constrained to a local path: these assets come
 * from Notion, whose URLs are signed and expire, so a remote src would publish
 * a page that goes blank later without failing the build.
 */
const caseStudyBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), level: z.union([z.literal(2), z.literal(3)]), text: z.string().trim().min(1) }).strict(),
  z.object({ type: z.literal("prose"), body: z.string().trim().min(1) }).strict(),
  z.object({ type: z.literal("callout"), body: z.string().trim().min(1) }).strict(),
  z.object({ type: z.literal("quote"), text: z.string().trim().min(1), source: z.string().trim().min(1).optional() }).strict(),
  z.object({ type: z.literal("list"), ordered: z.boolean(), items: z.array(z.string().trim().min(1)).min(1) }).strict(),
  z
    .object({
      type: z.literal("statRow"),
      items: z
        .array(
          z
            .object({
              value: z.string().trim().min(1),
              label: z.string().trim(),
              icon: z.string().trim().min(1).optional(),
            })
            .strict(),
        )
        .min(1),
    })
    .strict(),
  z
    .object({
      type: z.literal("image"),
      src: z.string().startsWith("/", "Case-study images must be local: Notion URLs expire"),
      alt: z.string(),
      caption: z.string().trim().min(1).optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
    })
    .strict(),
]);

/**
 * Case-study prose for the detail page. `null` is the "coming soon" state and
 * is the default: each case study is written from its own interview rather
 * than generated from the record.
 */
const localizedCaseStudySchema = z
  .object({
    brief: z.string().trim().min(1),
    context: z.string().trim().min(1),
    outcome: z.string().trim().min(1),
    sections: z
      .array(z.object({ heading: z.string().trim().min(1), body: z.string().trim().min(1) }).strict())
      .optional(),
    /** The long form. Independent of `sections`; a record may carry either or both. */
    blocks: z.array(caseStudyBlockSchema).optional(),
  })
  .strict();

export type CaseStudyBlock = z.infer<typeof caseStudyBlockSchema>;

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
    /**
     * `attribution` and `impact` were removed from the card on 2026-08-22.
     *
     * They still gate publication — a record cannot be exported unless its
     * attribution is confirmed in the store — but the store's PROSE is written
     * for the private corpus, not for a public repo: it names third parties by
     * role and carries internal evidentiary notes. No template ever rendered
     * either field, so publishing them was cost without benefit.
     *
     * The user-facing text is `copy[lang]`, which is written deliberately for
     * this surface. Keep it that way: do not re-add a raw store field here.
     */
    /**
     * Three shapes, and the renderer must handle all three:
     *   { start, end }       a closed range   → "Mar 2024 – Aug 2024"
     *   { start, end: null } ongoing          → "Since Mar 2024"
     *   { start: null, end } delivered-only   → "Delivered Mar 2024"
     *
     * `start: null` is the agency case: Juan knows when his contribution ended
     * and the project began before he joined. Stating a start there would
     * overclaim the engagement, so the store records the contribution window
     * and this renders it as a delivery, not a range.
     */
    dates: z
      .object({
        start: dateSchema.nullable(),
        end: dateSchema.nullable(),
      })
      .strict(),
    stack: z.array(stackIdSchema).min(1),
    liveUrl: hrefSchema,
    /** Optional: nine design-only records hold exactly one artifact. */
    evidenceLink: hrefSchema.optional(),
    featured: z.boolean(),
    preview: hrefSchema,

    /**
     * Ordering + filter facets for /projects, derived by the exporter from the
     * record's own links, role and stack — never authored by hand. A project
     * that earns a live URL rises on the next export with no edit here.
     */
    evidenceWeight: z.number().int().min(0),
    evidenceSignals: z
      .object({
        liveSite: z.boolean(),
        storeListing: z.boolean(),
        sourceCode: z.boolean(),
        designAndCode: z.boolean(),
        productStack: z.boolean(),
        designArtifact: z.boolean(),
      })
      .strict(),

    caseStudy: z
      .object({ en: localizedCaseStudySchema, pt: localizedCaseStudySchema })
      .strict()
      .nullable(),
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
