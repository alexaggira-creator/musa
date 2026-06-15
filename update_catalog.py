import os
import re

def parse_filename(filename):
    name = filename.split('.')[0]
    
    talla_match = re.search(r'[Tt]alla\s+([^.$]+)', filename)
    price_match = re.search(r'\$([\d.]+)', filename)
    
    talla = talla_match.group(1).strip() if talla_match else ""
    price_str = price_match.group(1).replace('.', '') if price_match else "0"
    try:
        price = int(price_str)
    except:
        price = 0
        
    formatted_price = f"${price_match.group(1)} COP" if price_match else ""
    if not formatted_price and price > 0:
        formatted_price = f"${price:,} COP".replace(',', '.')
        
    return name, talla, price, formatted_price

categories = {
    "PIJAMAS": "pijamas",
    "Lenceria": "lenceria"
}

html_cards = []
delay = 0.1

for folder, cat in categories.items():
    if not os.path.exists(folder): continue
    for f in os.listdir(folder):
        if not f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')): continue
        
        name, talla, price, formatted_price = parse_filename(f)
        img_path = f"{folder}/{f}"
        
        talla_html = f'<p style="margin: 5px 0; font-size: 0.9em; color: #666;">Talla: {talla}</p>' if talla else ''
        price_html = f'<p class="price">{formatted_price}</p>' if formatted_price else ''
        
        data_sizes = talla if talla else "S,M,L,XL"
        data_price = price if price else 0
        
        card = f"""
                <div class="premium-card reveal-up" data-category="{cat}" style="transition-delay: {delay}s;">
                    <div class="card-img-container">
                        <img src="{img_path}" alt="{name}"
                            class="product-image"
                            onerror="this.src='https://images.unsplash.com/photo-1620612261623-261ba0cd58cb?q=80&w=2070&auto=format&fit=crop'">
                        <div class="card-overlay">
                            <button class="btn-solid w-100 buy-btn" data-sizes="{data_sizes}" data-product="{name}" data-price="{data_price}"
                                data-img="{img_path}"><i
                                    class="fas fa-cart-plus"></i> Al Carrito</button>
                        </div>
                    </div>
                    <div class="card-details">
                        <h4>{name}</h4>
                        {talla_html}
                        {price_html}
                    </div>
                </div>"""
        html_cards.append(card)
        delay += 0.1
        if delay > 0.3:
            delay = 0.1

cards_str = "\n".join(html_cards)

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = re.compile(r'(<div class="premium-grid masonry-layout" id="products-grid">).*?(</section>)', re.DOTALL)

new_content = pattern.sub(r'\1\n' + cards_str.replace('\\', '\\\\') + r'\n            </div>\n        \2', content)

# Also update the editorial images
new_content = new_content.replace(
    '<img src="https://images.unsplash.com/photo-1596700683074-cefc379bd479?q=80&w=2069&auto=format&fit=crop"',
    '<img src="Lenceria/Luxe Secret. Talla M. $60.000.jpeg"'
)
new_content = new_content.replace(
    '<img src="https://images.unsplash.com/photo-1620612261623-261ba0cd58cb?q=80&w=2070&auto=format&fit=crop"',
    '<img src="PIJAMAS/Soft Rose. Talla M. $40.000.jpeg"'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Update complete")
