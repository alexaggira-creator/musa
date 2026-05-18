const fs = require('fs');
const path = require('path');

const dir = 'Lenceria';
const htmlFile = 'index.html';

const files = fs.readdirSync(dir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
let html = fs.readFileSync(htmlFile, 'utf8');

let newItemsHtml = '';
let count = 21; // Since we already have up to Lencería 20

for (const file of files) {
    if (!html.includes(`Lenceria/${file}`)) {
        const productNum = count++;
        const price = 75000;
        newItemsHtml += `
                <!-- Lencería ${productNum} -->
                <div class="premium-card reveal-up" data-category="lenceria" style="transition-delay: 0.1s;">
                    <div class="card-img-container">
                        <img src="Lenceria/${file}" alt="Lencería Musa" class="product-image">
                        <div class="card-overlay">
                            <button class="btn-solid w-100 buy-btn" data-product="Lencería Musa ${productNum}" data-price="${price}"
                                data-img="Lenceria/${file}"><i class="fas fa-cart-plus"></i> Al
                                Carrito</button>
                        </div>
                    </div>
                    <div class="card-details">
                        <h4>Musa Collection ${productNum}</h4>
                        <div class="size-selector"><span class="size-option selected">M</span></div>
                        <p class="price">$${(price/1000).toFixed(3)}.000 COP</p>
                    </div>
                </div>
`;
    }
}

if (newItemsHtml) {
    // Find where the premium-grid masonry-layout ends (the closing div before </section> <!-- /boutique -->)
    // Actually, looking at index.html, the end of the boutique section is:
    //             </div> <!-- /premium-grid masonry-layout -->
    //         </section> <!-- /boutique -->
    
    html = html.replace('            </div> <!-- /premium-grid masonry-layout -->', newItemsHtml + '\n            </div> <!-- /premium-grid masonry-layout -->');
    fs.writeFileSync(htmlFile, html, 'utf8');
    console.log(`Added ${count - 21} new images.`);
} else {
    console.log('No new images to add.');
}
