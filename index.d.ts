// index.d.ts

export interface Plugin {
    name: string;
    enforce?: 'pre' | 'post';
    configResolved?: (config: any) => void;
    resolveId?: (id: string, importer?: string) => string | null | Promise<string | null>;
    load?: (id: string) => { code: string } | null | Promise<{ code: string } | null>;
}

export type HulakMode = 'javascript' | 'typescript' | 'js' | 'ts';

export interface HulakHandlebarsOptions {
    /**
     * Directory where HTML partials are located.
     * Default: "src/html"
     * @type {string}
     * @default "src/html"
     */
    partialDirectory?: string;
}

export interface HulakPluginConfig {
    /**
     * Output mode: influences how you can further extend the plugin
     * ('javascript' / 'js' or 'typescript' / 'ts').
     * Currently only used for normalization, but fully typed for future use.
     * @type {HulakMode}
     */
    mode?: HulakMode;

    /**
     * Enable support for Handlebars templates.
     * @type {boolean}
     */
    enableHandlebars?: boolean;

    /**
     * Options for the Handlebars part of the plugin.
     * @type {HulakHandlebarsOptions}
     */
    handlebarsOptions?: HulakHandlebarsOptions;
}

/**
 * The main function for the Hulak Vite plugin.
 * Returns an array of Vite plugins (currently only the Handlebars plugin, if enabled).
 *
 * @param {HulakPluginConfig} [config] - The configuration object for the Hulak plugin.
 * @returns {Plugin[]} An array of Vite plugins.
 */
export function hulakPlugins(config?: HulakPluginConfig): Plugin[];

/**
 * The default export for the Hulak Vite plugin.
 * @type {function(HulakPluginConfig?): Plugin[]}
 */
export default hulakPlugins;