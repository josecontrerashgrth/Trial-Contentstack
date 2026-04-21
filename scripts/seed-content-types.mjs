#!/usr/bin/env node
/**
 * seed-content-types.mjs
 *
 * Crea el content type `page` con todos sus campos y block types en Contentstack.
 * Es idempotente: si el content type ya existe, lo actualiza; si no, lo crea.
 *
 * Variables de entorno necesarias:
 *   CONTENTSTACK_MANAGEMENT_TOKEN  → Settings > Tokens > Management Tokens
 *   NEXT_PUBLIC_CONTENTSTACK_API_KEY → Settings > Stack > API Key
 *   CONTENTSTACK_REGION            → EU | US | AZURE_EU | AZURE_NA  (default: EU)
 *
 * Uso:
 *   node scripts/seed-content-types.mjs
 *
 * Si prefieres usar el authtoken de la sesión CLI (después de `csdx auth:login`):
 *   CONTENTSTACK_AUTHTOKEN=<token> node scripts/seed-content-types.mjs
 */

import contentstack from "@contentstack/management";
import { config } from "dotenv";

// Carga .env.local si existe
config({ path: ".env.local" });
config({ path: ".env" });

// ─── Configuración ────────────────────────────────────────────────────────────

const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN;
const AUTH_TOKEN = process.env.CONTENTSTACK_AUTHTOKEN;

const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;

const REGION_HOST_MAP = {
  EU: "eu-api.contentstack.com",
  US: "api.contentstack.io",
  AZURE_EU: "azure-eu-api.contentstack.com",
  AZURE_NA: "azure-na-api.contentstack.com",
};

const region = (
  process.env.CONTENTSTACK_REGION ||
  process.env.NEXT_PUBLIC_CONTENTSTACK_REGION ||
  "EU"
).toUpperCase();
const host = REGION_HOST_MAP[region] ?? REGION_HOST_MAP.EU;

if (!MANAGEMENT_TOKEN && !AUTH_TOKEN) {
  console.error(
    "❌  Falta token de autenticación. Necesitas una de estas variables:\n\n" +
      "   NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN\n" +
      "     → Management Token (Settings > Tokens > Management Tokens)\n" +
      "     → Asegúrate de añadirlo a .env.local\n\n" +
      "   CONTENTSTACK_AUTHTOKEN\n" +
      "     → Token de sesión CLI (ejecuta primero: csdx auth:login)\n",
  );
  process.exit(1);
}

if (!API_KEY) {
  console.error("❌  Falta NEXT_PUBLIC_CONTENTSTACK_API_KEY en .env.local");
  process.exit(1);
}

// ─── Helpers de campos ────────────────────────────────────────────────────────

const text = (
  uid,
  display_name,
  { mandatory = false, unique = false } = {},
) => ({
  uid,
  display_name,
  data_type: "text",
  mandatory,
  unique,
  field_metadata: { description: "", default_value: "" },
  multiple: false,
});

const rte = (uid, display_name) => ({
  uid,
  display_name,
  data_type: "text",
  mandatory: false,
  multiple: false,
  field_metadata: {
    allow_rich_text: true,
    description: "",
    default_value: "",
    multiline: false,
    rich_text_type: "advanced",
  },
});

const file = (uid, display_name) => ({
  uid,
  display_name,
  data_type: "file",
  mandatory: false,
  multiple: false,
  field_metadata: {},
});

const select = (uid, display_name, values) => ({
  uid,
  display_name,
  data_type: "text",
  mandatory: false,
  multiple: false,
  display_type: "dropdown",
  enum: { advanced: false, choices: values.map((v) => ({ value: v })) },
  field_metadata: { description: "", default_value: "" },
});

// ─── Esquema del content type `page` ─────────────────────────────────────────
//
// Estructura de bloques en el campo `sections` (page builder):
//   hero_section        → HeroBlock
//   rich_text_section   → RichTextBlock
//   image_text_section  → ImageTextBlock (= Block)
//   features_section    → FeaturesBlock (con sub-grupo `cards`)

const blockSchema = [
  text("title", "Title"),
  rte("copy", "Copy"),
  file("image", "Image"),
  select("layout", "Layout", ["image_left", "image_right"]),
  select("column", "Column", ["column_true", "column_false"]),
];

const pageSchema = {
  title: "Page",
  uid: "page",
  description: "Páginas del sitio web",
  options: {
    title: "title",
    publishable: true,
    is_page: true,
    singleton: false,
    sub_title: ["url"],
  },
  schema: [
    // El campo `title` es creado automáticamente por Contentstack como primer campo.
    // Lo declaramos aquí para añadir `unique: true`.
    text("title", "Title", { mandatory: true, unique: true }),
    text("url", "URL", { mandatory: true, unique: true }),
    text("description", "Description"),
    file("image", "Image"),
    rte("rich_text", "Rich Text"),

    // ── Campo `blocks` (modular blocks clásicos) ──────────────────────────
    {
      uid: "blocks",
      display_name: "Blocks",
      data_type: "blocks",
      mandatory: false,
      multiple: true,
      blocks: [
        {
          title: "Block",
          uid: "block",
          schema: blockSchema,
        },
      ],
    },

    // ── Campo `sections` (page builder) ───────────────────────────────────
    {
      uid: "sections",
      display_name: "Sections",
      data_type: "blocks",
      mandatory: false,
      multiple: true,
      blocks: [
        // hero_section
        {
          title: "Hero Section",
          uid: "hero_section",
          schema: [
            text("title", "Title"),
            text("description", "Description"),
            file("image", "Image"),
            text("cta_label", "CTA Label"),
            text("cta_href", "CTA URL"),
          ],
        },

        // rich_text_section
        {
          title: "Rich Text Section",
          uid: "rich_text_section",
          schema: [rte("content", "Content")],
        },

        // image_text_section (misma forma que `block`)
        {
          title: "Image Text Section",
          uid: "image_text_section",
          schema: blockSchema,
        },

        // features_section
        // `cards` se implementa como grupo múltiple (más ampliamente soportado
        // que modular blocks anidados). La delivery API devuelve un array plano,
        // lo que simplifica los tipos en lib/types.ts.
        {
          title: "Features Section",
          uid: "features_section",
          schema: [
            text("section_title", "Section Title"),
            {
              uid: "cards",
              display_name: "Cards",
              data_type: "group",
              mandatory: false,
              multiple: true,
              schema: [
                text("title", "Title"),
                rte("copy", "Copy"),
                file("image", "Image"),
              ],
            },
          ],
        },
      ],
    },
  ],
};

// ─── Ejecución ────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n🔗  Conectando a Contentstack (${region} – ${host})…`);

  // Dos modos de autenticación:
  // 1. Management Token (stack-scoped) → va en stack(), NO en client()
  // 2. Authtoken de sesión CLI          → va en client()
  const client = contentstack.client({
    ...(AUTH_TOKEN ? { authtoken: AUTH_TOKEN } : {}),
    host,
  });

  const stack = client.stack({
    api_key: API_KEY,
    ...(MANAGEMENT_TOKEN ? { management_token: MANAGEMENT_TOKEN } : {}),
  });

  try {
    // Verificar conexión intentando listar content types
    await stack.contentType().query().find();
    console.log("✅  Conexión establecida con el stack.");
  } catch (err) {
    console.error("❌  No se pudo conectar al stack:", err.message);
    process.exit(1);
  }

  // Intentar crear; si ya existe (409), actualizar.
  try {
    console.log("\n📝  Creando content type `page`…");
    await stack.contentType().create({ content_type: pageSchema });
    console.log("✅  Content type `page` creado correctamente.");
  } catch (err) {
    if (err.status === 409 || err.errorCode === 115) {
      console.log(
        "⚠️   El content type `page` ya existe. Actualizando esquema…",
      );
      try {
        const ct = stack.contentType("page");
        await ct.fetch();
        ct.schema = pageSchema.schema;
        ct.options = pageSchema.options;
        await ct.update();
        console.log("✅  Content type `page` actualizado correctamente.");
      } catch (updateErr) {
        console.error(
          "❌  Error al actualizar el content type:",
          updateErr.message,
        );
        process.exit(1);
      }
    } else {
      console.error("❌  Error al crear el content type:", err.message, err);
      process.exit(1);
    }
  }

  console.log(
    "\n🎉  ¡Listo! Verifica el content type en Contentstack → Content Types → Page.\n",
  );
}

run();
