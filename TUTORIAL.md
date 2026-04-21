# Tutorial: Contentstack Kickstart con Next.js

Guía completa para configurar el proyecto, crear los content types en Contentstack, usar el sistema de secciones y añadir un menú de navegación.

---

## Tabla de contenidos

1. [Configuración inicial del proyecto](#1-configuración-inicial-del-proyecto)
2. [Variables de entorno](#2-variables-de-entorno)
3. [Arquitectura del proyecto](#3-arquitectura-del-proyecto)
4. [Crear el content type `page` en Contentstack](#4-crear-el-content-type-page-en-contentstack)
5. [Configurar el campo `sections` (page builder)](#5-configurar-el-campo-sections-page-builder)
   - [Block type: `hero_section`](#block-type-hero_section)
   - [Block type: `rich_text_section`](#block-type-rich_text_section)
   - [Block type: `image_text_section`](#block-type-image_text_section)
   - [Block type: `features_section`](#block-type-features_section)
6. [Crear entradas de página en Contentstack](#6-crear-entradas-de-página-en-contentstack)
7. [Añadir una nueva sección personalizada](#7-añadir-una-nueva-sección-personalizada)
8. [Añadir un menú de navegación](#8-añadir-un-menú-de-navegación)

---

## 1. Configuración inicial del proyecto

```bash
# Clona el repositorio
git clone https://github.com/contentstack/kickstart-next
cd kickstart-next

# Instala las dependencias
npm install

# Arranca el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 2. Variables de entorno

Crea el fichero `.env.local` en la raíz del proyecto con estos valores (los encuentras en **Contentstack → Settings → Stack → API Keys**):

```env
NEXT_PUBLIC_CONTENTSTACK_API_KEY=blt...
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=cs...
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=production
NEXT_PUBLIC_CONTENTSTACK_REGION=EU          # o US, AZURE_EU, etc.

# Live Preview / Visual Builder (opcional, sólo para modo preview)
NEXT_PUBLIC_CONTENTSTACK_PREVIEW=true
NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN=cs...
```

> **Nota:** Todas las variables empiezan por `NEXT_PUBLIC_` para que Next.js las exponga en el cliente (necesario para Live Preview).

---

## 3. Arquitectura del proyecto

```
app/
  page.tsx            → Ruta raíz "/" (home)
  [slug]/page.tsx     → Ruta dinámica para el resto de páginas

components/
  Page.tsx            → Orquesta todas las secciones de una página
  Preview.tsx         → Modo Live Preview (cliente)
  sections/
    SectionRenderer.tsx   → Dispatcher: decide qué sección renderizar según el block type UID
    HeroSection.tsx        → Cabecera con título, descripción, imagen y CTA
    RichTextSection.tsx    → Contenido HTML enriquecido
    BlocksSection.tsx      → Bloques imagen+texto (layout izquierda/derecha)
    FeaturesSection.tsx    → Cuadrícula de tarjetas de características
  ui/
    Button.tsx             → Botón/enlace reutilizable
    RichText.tsx           → HTML sanitizado con DOMPurify

lib/
  contentstack.ts     → Inicialización del SDK, getPage(), getPages()
  types.ts            → Interfaces TypeScript alineadas con el CMS
```

### Flujo de datos

```
Contentstack CMS
    │
    ▼
lib/contentstack.ts → getPage("/slug")
    │
    ▼
components/Page.tsx
    ├── HeroSection       (campos fijos: title, description, image)
    ├── RichTextSection   (campo fijo: rich_text)
    ├── BlocksSection     (campo fijo: blocks)
    └── SectionRenderer  (campo modular: sections)
            ├── hero_section       → HeroSection
            ├── rich_text_section  → RichTextSection
            ├── image_text_section → BlocksSection
            └── features_section   → FeaturesSection
```

---

## 4. Crear el content type `page` en Contentstack

Ve a **Contentstack → Content Types → + New Content Type**.

| Nombre visible | UID    | Descripción           |
| -------------- | ------ | --------------------- |
| Page           | `page` | Páginas del sitio web |

Añade los siguientes campos:

| Nombre visible | UID del campo | Tipo             | Notas                     |
| -------------- | ------------- | ---------------- | ------------------------- |
| Title          | `title`       | Single line text | Obligatorio, único        |
| URL            | `url`         | Single line text | Obligatorio. Ej: `/about` |
| Description    | `description` | Single line text | —                         |
| Image          | `image`       | File             | Imagen principal          |
| Rich Text      | `rich_text`   | Rich text editor | —                         |
| Blocks         | `blocks`      | Modular Blocks   | Ver nota 1                |
| Sections       | `sections`    | Modular Blocks   | Ver sección 5             |

> **Nota 1 – campo `blocks`:** Configura un block type con UID `block` que tenga: `title` (text), `copy` (rich text), `image` (file), `layout` (select con opciones `image_left` e `image_right`).

---

## 5. Configurar el campo `sections` (page builder)

El campo `sections` es un **Modular Blocks** que actúa como page builder. Cada block type que añadas aquí aparecerá como opción para el editor en Contentstack.

> **Importante:** El UID del block type en Contentstack debe coincidir **exactamente** con el nombre de la clave que comprueba `SectionRenderer.tsx`.

---

### Block type: `hero_section`

**UID:** `hero_section`

| Campo       | UID           | Tipo             |
| ----------- | ------------- | ---------------- |
| Title       | `title`       | Single line text |
| Description | `description` | Single line text |
| Image       | `image`       | File             |
| CTA Label   | `cta_label`   | Single line text |
| CTA URL     | `cta_href`    | Single line text |

---

### Block type: `rich_text_section`

**UID:** `rich_text_section`

| Campo   | UID       | Tipo             |
| ------- | --------- | ---------------- |
| Content | `content` | Rich text editor |

---

### Block type: `image_text_section`

**UID:** `image_text_section`

| Campo  | UID      | Tipo             | Opciones                    |
| ------ | -------- | ---------------- | --------------------------- |
| Title  | `title`  | Single line text | —                           |
| Copy   | `copy`   | Rich text editor | —                           |
| Image  | `image`  | File             | —                           |
| Layout | `layout` | Select           | `image_left`, `image_right` |

---

### Block type: `features_section`

**UID:** `features_section`

| Campo         | UID             | Tipo             |
| ------------- | --------------- | ---------------- |
| Section Title | `section_title` | Single line text |
| Cards         | `cards`         | Modular Blocks   |

El sub-campo **cards** usa el mismo block type `block` que ya existe en el campo `blocks` del content type page (con los campos `title`, `copy`, `image`, `layout`).

---

## 6. Crear entradas de página en Contentstack

1. Ve a **Content → + New Entry → Page**.
2. Rellena el campo **URL** con una ruta absoluta, por ejemplo `/about`.
3. En el campo **Sections** pulsa **+ Add block** y elige el tipo de sección que quieras.
4. Publica la entrada.
5. La página estará disponible automáticamente en `http://localhost:3000/about`.

> La ruta `/` está reservada para la home (`app/page.tsx`). Todas las demás URLs del campo `url` se resuelven con la ruta dinámica `app/[slug]/page.tsx`.

---

## 7. Añadir una nueva sección personalizada

Ejemplo: añadir una sección de **CTA Banner** (`cta_banner`).

### Paso 1 – Contentstack CMS

Crea un nuevo block type dentro del campo `sections` con:

- **UID del block type:** `cta_banner`
- Campos: `heading` (text), `subheading` (text), `button_label` (text), `button_url` (text), `background_color` (text)

### Paso 2 – TypeScript (`lib/types.ts`)

```ts
export interface CtaBannerBlock {
  heading?: string;
  subheading?: string;
  button_label?: string;
  button_url?: string;
  background_color?: string;
  _metadata?: { uid: string };
  $?: {
    heading?: CSLPFieldMapping;
    subheading?: CSLPFieldMapping;
    button_label?: CSLPFieldMapping;
    button_url?: CSLPFieldMapping;
  };
}
```

Añade la clave a `SectionItem`:

```ts
export interface SectionItem {
  // ...existentes...
  cta_banner?: CtaBannerBlock; // ← nuevo
}
```

### Paso 3 – Componente React (`components/sections/CtaBannerSection.tsx`)

```tsx
import { CtaBannerBlock } from "@/lib/types";
import Button from "@/components/ui/Button";

interface CtaBannerSectionProps {
  data: CtaBannerBlock;
}

export default function CtaBannerSection({ data }: CtaBannerSectionProps) {
  return (
    <section
      className="py-20 px-4 text-center"
      style={{ backgroundColor: data.background_color ?? "#1d4ed8" }}
    >
      {data.heading && (
        <h2
          className="text-4xl font-bold text-white mb-4"
          {...(data.$?.heading ?? {})}
        >
          {data.heading}
        </h2>
      )}
      {data.subheading && (
        <p className="text-white/80 mb-8" {...(data.$?.subheading ?? {})}>
          {data.subheading}
        </p>
      )}
      {data.button_label && data.button_url && (
        <Button
          label={data.button_label}
          href={data.button_url}
          variant="secondary"
        />
      )}
    </section>
  );
}
```

### Paso 4 – Registrar en `SectionRenderer.tsx`

```tsx
import CtaBannerSection from "./CtaBannerSection";

// Dentro del map(), añadir antes del return null final:
if (item.cta_banner) {
  return (
    <div key={key} {...(blockCslp ?? {})}>
      <CtaBannerSection data={item.cta_banner} />
    </div>
  );
}
```

---

## 8. Añadir un menú de navegación

### 8.1 Opción A – Menú estático en el layout

La forma más sencilla: edita `app/layout.tsx` para añadir un `<nav>` con los enlaces que quieras.

```tsx
// app/layout.tsx
import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi sitio",
  description: "Descripción del sitio",
};

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Acerca de", href: "/about" },
  { label: "Contacto", href: "/contact" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header className="border-b px-4 py-3">
          <nav className="max-w-screen-lg mx-auto flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="max-w-screen-lg mx-auto">{children}</main>
      </body>
    </html>
  );
}
```

> **Cuándo usarlo:** cuando los enlaces del menú no cambian frecuentemente y no necesitas gestionarlos desde el CMS.

---

### 8.2 Opción B – Menú dinámico desde Contentstack

Usa el CMS para gestionar los enlaces del menú sin tocar el código.

#### 8.2.1 Crear el content type `navigation` en Contentstack

| Nombre visible | UID     | Tipo             | Notas                   |
| -------------- | ------- | ---------------- | ----------------------- |
| Title          | `title` | Single line text | Obligatorio             |
| UID del menú   | `uid`   | Single line text | Ej: `main_nav`          |
| Links          | `links` | Group (multiple) | Ver tabla de sub-campos |

Sub-campos del grupo **links**:

| Nombre visible | UID     | Tipo             |
| -------------- | ------- | ---------------- |
| Label          | `label` | Single line text |
| URL            | `href`  | Single line text |

#### 8.2.2 Función de fetch (`lib/contentstack.ts`)

Añade esta función al fichero:

```ts
export interface NavLink {
  label: string;
  href: string;
}

export interface Navigation {
  uid: string;
  links?: NavLink[];
}

export async function getNavigation(
  navUid: string,
): Promise<Navigation | undefined> {
  const result = await stack
    .contentType("navigation")
    .entry()
    .query()
    .where("uid", QueryOperation.EQUALS, navUid)
    .find<Navigation>();

  return result.entries?.[0];
}
```

#### 8.2.3 Componente `Navbar` (`components/Navbar.tsx`)

```tsx
import Link from "next/link";
import { getNavigation } from "@/lib/contentstack";

export default async function Navbar() {
  const nav = await getNavigation("main_nav");

  return (
    <header className="border-b px-4 py-3">
      <nav className="max-w-screen-lg mx-auto flex gap-6 items-center">
        {nav?.links?.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-medium hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
```

#### 8.2.4 Añadir `Navbar` al layout

```tsx
// app/layout.tsx
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="max-w-screen-lg mx-auto">{children}</main>
      </body>
    </html>
  );
}
```

#### 8.2.5 Crear la entrada en Contentstack

1. Ve a **Content → + New Entry → Navigation**.
2. En **UID del menú** escribe `main_nav`.
3. Añade los links con sus labels y URLs (por ejemplo `/about`, `/contact`).
4. Publica la entrada.

> **Nota:** `Navbar` es un Server Component asíncrono, por lo que la petición al CMS se hace en el servidor y no expone tokens al cliente.

---

## Resumen rápido

| Tarea                             | Fichero clave                                       |
| --------------------------------- | --------------------------------------------------- |
| Inicialización del SDK            | `lib/contentstack.ts`                               |
| Tipos TypeScript del CMS          | `lib/types.ts`                                      |
| Orquestación de secciones         | `components/Page.tsx`                               |
| Dispatcher de secciones modulares | `components/sections/SectionRenderer.tsx`           |
| Nueva sección: interfaz           | `lib/types.ts` → `SectionItem`                      |
| Nueva sección: componente         | `components/sections/MiSeccion.tsx`                 |
| Nueva sección: registro           | `components/sections/SectionRenderer.tsx`           |
| Menú estático                     | `app/layout.tsx`                                    |
| Menú dinámico desde CMS           | `components/Navbar.tsx` + content type `navigation` |
