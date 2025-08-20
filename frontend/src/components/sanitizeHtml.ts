
// export function sanitizeHtml(html: string): string {
//   // Remove script/style tags and their content
//   html = html.replace(/<\/?(script|style)[^>]*>/gi, '');

//   // Remove event handler attributes (onerror, onclick, etc.)
//   html = html.replace(/ on\w+\s*=\s*(['"]).*?\1/gi, '');
//   html = html.replace(/ on\w+\s*=\s*[^ >]+/gi, '');

//   // Remove javascript: in href/src
//   html = html.replace(/(href|src)\s*=\s*(['"])javascript:[^\2]*\2/gi, '$1="#"');

//   // Allow only safe tags
//   const allowedTags = /<(\/)?(b|i|u|em|strong|a|ul|ol|li|br|p|img)( [^>]*)?>/gi;
//   html = html.replace(/<[^>]+>/gi, (tag) => {
//     return tag.match(allowedTags) ? tag : '';
//   });

//   return html;
// } 


export function sanitizeHtml(html: string): string {
  // Step 1: Remove dangerous tags with their content (script, style, iframe, object, embed, link)
  html = html.replace(/<\s*(script|style|iframe|object|embed|link)[^>]*>.*?<\s*\/\s*\1\s*>/gis, '');

  // Step 2: Remove self-closing or standalone dangerous tags (e.g. <script src="..."/>)
  html = html.replace(/<\s*(script|style|iframe|object|embed|link)[^>]*\/?\s*>/gi, '');

  // Step 3: Remove dangerous attributes like event handlers (onerror, onclick), style, srcdoc, formaction, etc.
  // This removes attributes with quoted values
  html = html.replace(/\s(on\w+|style|srcdoc|formaction)\s*=\s*(['"])[\s\S]*?\2/gi, '');
  // This removes attributes without quotes
  html = html.replace(/\s(on\w+|style|srcdoc|formaction)\s*=\s*[^\s>]+/gi, '');

  // Step 4: Neutralize javascript: and data: protocols in href and src attributes
  html = html.replace(/\s(href|src)\s*=\s*(['"]?)\s*javascript:[^'">\s]*\2/gi, ' $1="#"');
  html = html.replace(/\s(href|src)\s*=\s*(['"]?)\s*data:[^'">\s]*\2/gi, ' $1="#"');

  // Step 5: Allow only a whitelist of safe tags, remove all others
  const allowedTags = ['b', 'i', 'u', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'p', 'img'];
  html = html.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (tag, tagName) => {
    return allowedTags.includes(tagName.toLowerCase()) ? tag : '';
  });

  return html;
}

