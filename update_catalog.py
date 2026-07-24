import os
import re
import random

def parse_filename(filename):
    name = filename.split('.')[0]
    
    talla_match = re.search(r'[Tt]alla\s+([^.$]+)', filename)
    price_match = re.search(r'\$([\d.]+)', filename)
    
    talla_raw = talla_match.group(1).strip() if talla_match else ""
    
    # Manejar tallas múltiples: "S y XL", "S y M", "M y L", etc.
    if ' y ' in talla_raw.lower():
        tallas_parts = re.split(r'\s+y\s+', talla_raw, flags=re.IGNORECASE)
        talla = ','.join([t.strip().upper() for t in tallas_parts])
    else:
        talla = talla_raw
    
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

badges = [
    '<span class="status-badge hot">🔥 Más Vendido</span>',
    '<span class="status-badge urgent">✨ Última Unidad</span>',
    '<span class="status-badge urgent">💎 Edición Limitada</span>'
]

# Set a seed to have consistent layout and badges across reruns
random.seed(42)

all_files = []
for folder, cat in categories.items():
    if not os.path.exists(folder): continue
    for f in sorted(os.listdir(folder)):
        if not f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')): continue
        all_files.append((folder, cat, f))

# Mezclar los productos para que pijamas y lencería aparezcan combinados
random.shuffle(all_files)

for folder, cat, f in all_files:
    name, talla, price, formatted_price = parse_filename(f)
    img_path = f"{folder}/{f}"
    
    talla_html = f'<p style="margin: 5px 0; font-size: 0.9em; color: #666;">Talla: {talla}</p>' if talla else ''
    old_price = int(price) + 20000 if price else 0
    old_price_str = f"${old_price:,} COP".replace(',', '.') if old_price else ""
    price_html = f'<p class="price"><del class="old-price">{old_price_str}</del> <span class="new-price">{formatted_price}</span></p>' if formatted_price else ''
    
    data_sizes = talla if talla else "S,M,L,XL"
    data_price = price if price else 0
    
    # Randomly assign a badge to ~20% of products
    badge_html = ""
    if random.random() < 0.20:
        badge_html = random.choice(badges)
        
    card = f"""
                <div class="premium-card reveal-up" data-category="{cat}" style="transition-delay: {delay}s;">
                    <div class="card-img-container">
                        <img src="{img_path}" alt="{name}"
                            class="product-image" loading="lazy"
                            onerror="this.src='https://images.unsplash.com/photo-1620612261623-261ba0cd58cb?q=80&w=2070&auto=format&fit=crop'">
                        {badge_html}
                        <div class="card-overlay">
                            <button class="btn-solid w-100 buy-btn" data-sizes="{data_sizes}" data-product="{name}" data-price="{data_price}"
                                data-img="{img_path}"><i
                                    class="fas fa-heart"></i> Lo Quiero</button>
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

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("¡El catálogo se ha actualizado con éxito!")
input("\nPresiona ENTER para cerrar esta ventana...")
