// const weAreInProduction = process.env.NODE_ENV === "production";
// const assetPrefix = weAreInProduction ? "/preprosql" : "";

import { CSSProperties } from "react";

const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || "";

const apiPrefix = process.env.NEXT_PUBLIC_API || "http://localhost:8080";

const api = (path = "/"): string => `${apiPrefix}${path}`;

const urlFor = (path = "/"): string => `${assetPrefix}${path}`;

const redirect = (path = "/"): void =>
  window?.location?.replace(`${assetPrefix}${path}`);

/**
 * Convert template literal backtick-strings to React style objects for use as
 * inline-styles.
 *
 * Utility template literal parser
 *
 * @param {string | TemplateStringsArray | string[]} str
 * @returns
 */
const style = (
  str: string | TemplateStringsArray | string[] = ""
): CSSProperties => {
  const s = {};
  const myString = (str instanceof Array ? str.join("") : str)
    .replace(/ {2,}/g, "")
    .replace(/\n/g, "")
    .trim();

  const formatStringToCamelCase = (someString: string) => {
    const splitted = someString.split("-");
    if (splitted.length === 1) return splitted[0];
    return (
      splitted[0] +
      splitted
        .slice(1)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("")
    );
  };

  myString.split(";").forEach((el) => {
    const [property, value] = el.split(":");
    if (!property) return;
    const formattedProperty = formatStringToCamelCase(property.trim());
    s[formattedProperty] = value.trim();
  });

  return s;
};

const prettySize = (sizeInBytes: number): string => {
  const gb = 1 << 30;
  const mb = 1 << 20;
  const kb = 1 << 10;
  if (sizeInBytes < 0) return sizeInBytes.toString();
  if (sizeInBytes > gb) return `${sizeInBytes / gb} GB`;
  if (sizeInBytes > mb) return `${sizeInBytes / mb} MB`;
  if (sizeInBytes > kb) return `${sizeInBytes / kb} KB`;
  return `${sizeInBytes} bytes`;
};

export { assetPrefix, apiPrefix, api, redirect, style, urlFor, prettySize };
