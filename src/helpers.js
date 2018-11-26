export function formatForHoverboard(html) {
  let hoverHTML = html;
  let images = html.match(/<img.+?>/g);

  if (images) {
    images = images.map(image => image.match(/http.+?[^"]*/)[0]);
    console.log(images);
    images.forEach(url => {
      hoverHTML = hoverHTML.replace(
        /<img.+?>/,
        `<plastic-image srcset="${url}" lazy-load preload fade></plastic-image>`
      );
    });
  }

  return hoverHTML;
}
