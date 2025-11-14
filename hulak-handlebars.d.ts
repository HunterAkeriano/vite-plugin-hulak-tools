// hulak-handlebars.d.ts
export interface Plugin {
    name: string;
    enforce?: 'pre' | 'post';
    configResolved?: (config: any) => void;
    resolveId?: (id: string, importer?: string) => string | null | Promise<string | null>;
    load?: (id: string) => { code: string } | null | Promise<{ code: string } | null>;
}
/**
 * Options for the Handlebars part of the Hulak plugin.
 * @interface
 */
export interface HulakHandlebarsOptions {
    /**
     * Directory where HTML partials are located.
     * @type {string}
     */
    partialDirectory?: string;
}

/**
 * Runtime options for the Handlebars plugin, including the normalized mode.
 * @interface
 * @extends {HulakHandlebarsOptions}
 */
export interface HulakHandlebarsRuntimeOptions extends HulakHandlebarsOptions {
    /**
     * Normalized output mode ('javascript' or 'typescript').
     * This value is typically passed in via options.mode from the main configuration.
     * @type {'javascript' | 'typescript'}
     */
    mode?: 'javascript' | 'typescript';
}

/**
 * Vite plugin function for Handlebars support.
 *
 * @param {HulakHandlebarsRuntimeOptions} [options] - The runtime configuration options for the Handlebars plugin.
 * @returns {Plugin} A Vite plugin object.
 */
export default function hulakHandlebars(
    options?: HulakHandlebarsRuntimeOptions
): Plugin;