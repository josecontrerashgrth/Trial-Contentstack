import Image from "next/image";
import { Blocks, Page } from "@/lib/types";
import { VB_EmptyBlockParentClass } from "@contentstack/live-preview-utils";
import RichText from "@/components/ui/RichText";

interface BlocksSectionProps {
    blocks?: Blocks[];
    cslp?: Page["$"];
}

/**
 * BlocksSection – renderiza los modular blocks de Contentstack.
 * Cada bloque puede mostrar una imagen a la izquierda o derecha según el campo `layout`.
 * Soporta atributos CSLP para edición en Visual Builder.
 */
export default function BlocksSection({ blocks, cslp }: BlocksSectionProps) {
    return (
        <section
            className={`space-y-8 max-w-full py-8 px-4 ${!blocks || blocks.length === 0 ? VB_EmptyBlockParentClass : ""
                }`}
            {...(cslp?.blocks ?? {})}
        >
            {blocks?.map((item, index) => {
                const { block } = item;
                const isImageLeft = block.layout === "image_left";

                return (
                    <div
                        key={block._metadata?.uid ?? `block-${index}`}
                        {...(cslp?.[`blocks__${index}`] ?? {})}
                        className={`flex flex-col md:flex-row items-center gap-6 bg-white rounded-xl shadow-sm p-6 ${isImageLeft ? "md:flex-row" : "md:flex-row-reverse"
                            }`}
                    >
                        {/* Imagen del bloque */}
                        <div className="w-full md:w-1/2">
                            {block.image && (
                                <Image
                                    key={`image-${block._metadata?.uid ?? index}`}
                                    src={block.image.url}
                                    alt={block.image.title}
                                    width={400}
                                    height={225}
                                    className="w-full rounded-lg object-cover"
                                    {...(block.image.$?.url ?? {})}
                                />
                            )}
                        </div>

                        {/* Contenido del bloque */}
                        <div className="w-full md:w-1/2 flex flex-col gap-3">
                            {block.title && (
                                <h2
                                    className="text-2xl font-bold"
                                    {...(block.$?.title ?? {})}
                                >
                                    {block.title}
                                </h2>
                            )}

                            {block.copy && (
                                <RichText
                                    html={block.copy}
                                    className="prose"
                                    cslp={block.$?.copy}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
