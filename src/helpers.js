export function formatForHoverboard(html) {
  let hoverHTML = "";
  const images = html.match(/(?<=<img\ssrc=")(.*)(?="\s)/g);

  if (images) {
    images.forEach(url => {
      hoverHTML = html.replace(
        /<img.+?>/,
        `<plastic-image srcset="${url}" lazy-load preload fade></plastic-image>`
      );
    });
  }

  if (hoverHTML) return hoverHTML;
  return html;
}
