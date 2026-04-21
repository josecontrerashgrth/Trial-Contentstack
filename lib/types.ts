export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[] | object;
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  _metadata?: object;
  description?: string;
  dimension?: {
    height: number;
    width: number;
  };
  publish_details: PublishDetails;
  /** CSLP mapping for editable fields */
  $?: {
    url?: CSLPFieldMapping;
    title?: CSLPFieldMapping;
    filename?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
  };
}

export interface Link {
  title: string;
  href: string;
}

export interface Taxonomy {
  taxonomy_uid: string;
  max_terms?: number;
  mandatory: boolean;
  non_localizable: boolean;
}

export interface CSLPAttribute {
  "data-cslp"?: string;
  "data-cslp-parent-field"?: string;
}
export type CSLPFieldMapping = CSLPAttribute;

export interface SystemFields {
  uid?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  _content_type_uid?: string;
  tags?: string[];
  ACL?: any[];
  _version?: number;
  _in_progress?: boolean;
  locale?: string;
  publish_details?: PublishDetails;
  title?: string;
}

/** A block! */
export interface Block {
  /** Version */
  _version?: number;
  /** Title */
  title?: string;
  /** Copy */
  copy?: string;
  /** Image */
  image?: File | null;
  /** Layout */
  layout?: ("image_left" | "image_right") | null;
  column?: ("column_true" | "column_false") | null; // Example of an additional field for layout variations
  /** Metadata */
  _metadata?: { uid: string };
  /** CSLP mapping for editable fields */
  $?: {
    title?: CSLPFieldMapping;
    copy?: CSLPFieldMapping;
    image?: CSLPFieldMapping;
    layout?: CSLPFieldMapping;
  };
}

export interface Blocks extends SystemFields {
  block: Block;
}

// ─── Section block types for the `sections` modular blocks field ───────────
// Each interface below corresponds to one block type UID in Contentstack.
// The UID you set in the CMS must match the key checked in SectionRenderer.

export interface HeroBlock {
  title?: string;
  description?: string;
  image?: File | null;
  /** Single-line text field for the CTA button label */
  cta_label?: string;
  /** Single-line text field for the CTA button URL */
  cta_href?: string;
  _metadata?: { uid: string };
  $?: {
    title?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    image?: CSLPFieldMapping;
    cta_label?: CSLPFieldMapping;
    cta_href?: CSLPFieldMapping;
  };
}

export interface RichTextBlock {
  /** Rich text field */
  content?: string;
  _metadata?: { uid: string };
  $?: {
    content?: CSLPFieldMapping;
  };
}

/** Image + text block – same field shape as the existing `Block` type. */
export type ImageTextBlock = Block;

export interface FeaturesBlock {
  section_title?: string;
  /** Group field (array plano, sin wrapper `block`) */
  cards?: Block[];
  _metadata?: { uid: string };
  $?: {
    section_title?: CSLPFieldMapping;
    cards?: CSLPFieldMapping;
    [key: string]: CSLPFieldMapping | undefined;
  };
}

/**
 * One item in the `sections` modular blocks field on the `page` content type.
 * Contentstack sets exactly one block-type key per item.
 *
 * Block type UIDs to create in the CMS:
 *   hero_section        → HeroBlock fields
 *   rich_text_section   → RichTextBlock fields
 *   image_text_section  → ImageTextBlock fields (title, copy, image, layout)
 *   features_section    → FeaturesBlock fields
 */
export interface SectionItem {
  _metadata?: { uid: string };
  hero_section?: HeroBlock;
  rich_text_section?: RichTextBlock;
  image_text_section?: ImageTextBlock;
  features_section?: FeaturesBlock;
}

export interface Page extends SystemFields {
  /** UID - required for live preview */
  uid: string;
  /** Version */
  _version?: number;
  /** Title */
  title: string;
  /** URL */
  url?: string;
  /** Description */
  description?: string;
  /** Image */
  image?: File | null;
  /** Rich Text */
  rich_text?: string;
  /** blocks */
  blocks?: Blocks[];
  /** sections – page builder modular blocks */
  sections?: SectionItem[];
  /** CSLP mapping for editable fields */
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    image?: CSLPFieldMapping;
    rich_text?: CSLPFieldMapping;
    blocks?: CSLPFieldMapping;
    sections?: CSLPFieldMapping;
    [key: string]: CSLPFieldMapping | undefined; // Allow dynamic block indexing
  };
}
