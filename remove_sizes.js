const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// We want to remove the <div class="size-selector">...</div> block 
// from within the card-details div, but NOT the one inside the lightbox.
// In the grid cards, it looks like:
// <div class="size-selector"> ... </div>
// or
// <div class="size-selector"><span class="size-option selected">M</span></div>

// Let's use a regex to replace all instances of `<div class="size-selector">...</div>`
// We need to be careful with multi-line matches.
// We can use an regex that matches <div class="size-selector"> and everything up to the matching </div>
// As long as it doesn't match id="lightbox-sizes" or class="size-selector premium-sizes"

const regex = /<div class="size-selector">\s*(<span[^>]*>.*?<\/span>\s*)*<\/div>/g;

let matches = html.match(regex);
console.log('Matches found:', matches ? matches.length : 0);

html = html.replace(regex, '');

fs.writeFileSync(file, html, 'utf8');
console.log('Removed size selectors from product cards.');
