// lib/scopeCss.ts
import postcss from "postcss";
import prefixSelector from "postcss-prefix-selector";

/**
 * Scopes a CSS string so that every selector applies only inside `prefix`
 * @param css - Original CSS string
 * @param prefix - The container class to scope under, e.g. ".doc-container"
 * @returns scoped CSS string
 */
export async function scopeCss(css: string, prefix = ".doc-container") {
  const result = await postcss([
    prefixSelector({
      prefix,
      transform: (prefix, selector, prefixedSelector) => {
        // skip at-rules like @keyframes, @media
        if (selector.startsWith("@")) return selector;
        return prefixedSelector;
      },
    }),
  ]).process(css, { from: undefined });

  return result.css;
}
