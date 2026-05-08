document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Glassmorphism effect on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 232, 240, 0.95)'; // Rosadito sólido
            navbar.style.borderBottom = '1px solid rgba(255, 127, 165, 0.2)';
            navbar.style.padding = '15px 6%';
        } else {
            navbar.style.background = 'rgba(255, 232, 240, 0.8)'; // Rosadito translúcido
            navbar.style.borderBottom = '1px solid rgba(255, 127, 165, 0.1)';
            navbar.style.padding = '20px 6%';
        }
    });

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });

    // ==========================================
    // 3. SHOPPING CART LOGIC
    // ==========================================
    let cart = [];
    const cartIcon = document.getElementById('cart-icon');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    
    // Configura tu número aquí
    const numeroWhatsApp = "573000000000"; 

    // Abrir carrito
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    // Cerrar carrito
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function openCart() {
        cartOverlay.classList.add('active');
        cartSidebar.classList.add('active');
        renderCart();
    }

    function closeCart() {
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
    }

    // Formatear moneda
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(number);
    };

    // Añadir al carrito
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                name: button.getAttribute('data-product'),
                price: parseInt(button.getAttribute('data-price')),
                img: button.getAttribute('data-img'),
                id: Date.now() // unique id for each added item
            };

            cart.push(product);
            updateCartCount();
            openCart();
            
            // Sweet visual feedback on button
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
            button.style.background = '#25D366'; // WhatsApp Green to show success
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 1500);
        });
    });

    function updateCartCount() {
        cartCount.textContent = cart.length;
        // Animación pequeña en el contador
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
    }

    // Renderizar items del carrito
    function renderCart() {
        // Limpiar el contenedor (excepto el mensaje de vacío que lo ocultamos/mostramos)
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.appendChild(emptyCartMsg);
            emptyCartMsg.style.display = 'block';
        } else {
            // No mostrar mensaje vacío
            emptyCartMsg.style.display = 'none';

            cart.forEach((item, index) => {
                total += item.price;
                
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                
                // Fallback de imagen
                const imgSrc = item.img || 'https://images.unsplash.com/photo-1620612261623-261ba0cd58cb?q=80&w=200&auto=format&fit=crop';

                itemEl.innerHTML = `
                    <img src="${imgSrc}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1620612261623-261ba0cd58cb?q=80&w=200&auto=format&fit=crop'">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formatCurrency(item.price)}</div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                removeFromCart(index);
            });
        });

        cartTotalPrice.textContent = formatCurrency(total);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartCount();
        renderCart();
    }

    // Enviar pedido por WhatsApp
    const checkoutBtn = document.getElementById('checkout-whatsapp');
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('¡Tu carrito está vacío! Añade productos para realizar un pedido.');
            return;
        }

        let mensaje = `✨ *¡Hola Musa! Quiero realizar un pedido* ✨\n\n`;
        mensaje += `Mis productos seleccionados son:\n`;
        
        let total = 0;
        cart.forEach((item, i) => {
            mensaje += `🛒 ${i+1}. *${item.name}* (Talla M) - ${formatCurrency(item.price)}\n`;
            total += item.price;
        });

        mensaje += `\n💰 *Total Estimado:* ${formatCurrency(total)}\n\n`;
        mensaje += `Quisiera proceder con el pago y coordinar el envío. ¡Gracias! 💕`;

        const encodedMessage = encodeURIComponent(mensaje);
        const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    });

    // Botón flotante genérico de WhatsApp
    const waGeneral = document.getElementById('wa-float-general');
    if (waGeneral) {
        waGeneral.addEventListener('click', (e) => {
            e.preventDefault();
            const mensajeInfo = "✨ ¡Hola! Vengo de su página web y quiero más información sobre sus productos exclusivos. ✨";
            window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeInfo)}`, '_blank');
        });
    }

    // ==========================================
    // 4. IMAGE LIGHTBOX (VIEW FULLSCREEN)
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const productImages = document.querySelectorAll('.product-image');

    productImages.forEach(img => {
        img.addEventListener('click', () => {
            if (lightboxImg && lightbox) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            }
        });
    });

    const closeLightbox = () => {
        if (lightbox) lightbox.classList.remove('active');
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                closeLightbox();
            }
        });
    }
});
