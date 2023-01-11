const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;

export function encodeSVG(data: string) {
  // Use single quotes instead of double to avoid encoding.
  data = data.replace(/'/g, `'`);

  data = data.replace(/>\s{1,}</g, `><`);
  data = data.replace(/\s{2,}/g, ` `);

  // Using encodeURIComponent() as replacement function
  // allows to keep result code readable
  return data.replace(symbols, encodeURIComponent);
}
