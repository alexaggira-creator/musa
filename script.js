document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Glassmorphism & Mobile Menu
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Cerrar menú móvil al hacer click en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        });
    });

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
    
    // Timer elements
    const cartTimer = document.getElementById('cart-timer');
    const timerCountdown = document.getElementById('timer-countdown');
    let timerInterval = null;
    let timerTime = 15 * 60; // 15 minutos
    
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
        if (!cartSidebar.classList.contains('active')) {
            history.pushState({ modalOpen: true }, "");
        }
        cartOverlay.classList.add('active');
        cartSidebar.classList.add('active');
        renderCart();
    }

    function closeCart() {
        const wasActive = cartSidebar.classList.contains('active');
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
        if (wasActive && history.state && history.state.modalOpen) {
            history.back();
        }
    }

    // Manejar el botón de atrás del celular
    window.addEventListener('popstate', (e) => {
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            cartOverlay.classList.remove('active');
            cartSidebar.classList.remove('active');
        }
        const lightboxEl = document.getElementById('lightbox');
        if (lightboxEl && lightboxEl.classList.contains('active')) {
            lightboxEl.classList.remove('active');
        }
    });

    // Formatear moneda
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(number);
    };

    // Añadir al carrito (desde tarjetas directamente - sin talla, se agrega como "Única")
    const buyButtons = document.querySelectorAll('.premium-card .buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const sizes = button.getAttribute('data-sizes');
            const sizesArray = sizes ? sizes.split(',').map(s => s.trim()) : ['Única'];
            
            const product = {
                name: button.getAttribute('data-product'),
                price: parseInt(button.getAttribute('data-price')),
                img: button.getAttribute('data-img'),
                size: sizesArray[0], // Primera talla disponible por defecto
                id: Date.now()
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
        
        // Calcular total primero
        cart.forEach((item) => {
            total += item.price;
        });

        // Shipping Progress Bar Logic
        const shippingThreshold = 150000;
        const shippingProgressContainer = document.getElementById('shipping-progress-container');
        const shippingText = document.getElementById('shipping-text');
        const shippingBar = document.getElementById('shipping-bar');

        if (cart.length === 0) {
            cartItemsContainer.appendChild(emptyCartMsg);
            emptyCartMsg.style.display = 'block';
            if (cartTimer) cartTimer.style.display = 'none';
            if (shippingProgressContainer) shippingProgressContainer.style.display = 'none';
        } else {
            // No mostrar mensaje vacío
            emptyCartMsg.style.display = 'none';
            if (cartTimer) {
                cartTimer.style.display = 'block';
                startCartTimer();
            }
            
            if (shippingProgressContainer) {
                shippingProgressContainer.style.display = 'block';
                if (total >= shippingThreshold) {
                    shippingText.innerHTML = '¡Felicidades! Tienes <span style="color:#25D366">Envío Gratis</span> 🎉';
                    shippingBar.style.width = '100%';
                    shippingBar.style.background = '#25D366';
                } else {
                    const remaining = shippingThreshold - total;
                    shippingText.innerHTML = `Faltan <span style="color:var(--primary)">${formatCurrency(remaining)}</span> para envío gratis`;
                    const percentage = (total / shippingThreshold) * 100;
                    shippingBar.style.width = `${percentage}%`;
                    shippingBar.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
                }
            }

            cart.forEach((item, index) => {
                
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                
                // Fallback de imagen
                const imgSrc = item.img || 'https://images.unsplash.com/photo-1620612261623-261ba0cd58cb?q=80&w=200&auto=format&fit=crop';

                itemEl.innerHTML = `
                    <img src="${imgSrc}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1620612261623-261ba0cd58cb?q=80&w=200&auto=format&fit=crop'">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-size">Talla: ${item.size || 'Única'}</div>
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
        renderUpsell();
    }
    
    // UPSELL LOGIC
    const cartUpsell = document.getElementById('cart-upsell');
    const upsellImg = document.getElementById('upsell-img');
    const upsellName = document.getElementById('upsell-name');
    const upsellPrice = document.getElementById('upsell-price');
    const upsellAddBtn = document.getElementById('upsell-add-btn');
    let currentUpsellProduct = null;

    function renderUpsell() {
        if (!cartUpsell) return;
        if (cart.length === 0) {
            cartUpsell.style.display = 'none';
            return;
        }
        
        const cartNames = cart.map(item => item.name);
        const allCards = document.querySelectorAll('.premium-card .buy-btn');
        let availableProducts = [];
        
        allCards.forEach(btn => {
            const name = btn.getAttribute('data-product');
            if (!cartNames.includes(name)) {
                availableProducts.push({
                    name: name,
                    price: parseInt(btn.getAttribute('data-price')),
                    img: btn.getAttribute('data-img'),
                    sizes: btn.getAttribute('data-sizes')
                });
            }
        });

        if (availableProducts.length > 0) {
            if (!currentUpsellProduct || cartNames.includes(currentUpsellProduct.name)) {
                currentUpsellProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
            }
            upsellImg.src = currentUpsellProduct.img;
            upsellName.textContent = currentUpsellProduct.name;
            upsellPrice.textContent = formatCurrency(currentUpsellProduct.price);
            cartUpsell.style.display = 'block';
        } else {
            cartUpsell.style.display = 'none';
        }
    }

    if (upsellAddBtn) {
        upsellAddBtn.addEventListener('click', () => {
            if (currentUpsellProduct) {
                const sizesArray = currentUpsellProduct.sizes ? currentUpsellProduct.sizes.split(',').map(s => s.trim()) : ['Única'];
                cart.push({
                    name: currentUpsellProduct.name,
                    price: currentUpsellProduct.price,
                    img: currentUpsellProduct.img,
                    size: sizesArray[0],
                    id: Date.now()
                });
                updateCartCount();
                renderCart();
                
                const originalText = upsellAddBtn.innerHTML;
                upsellAddBtn.innerHTML = '<i class="fas fa-check"></i>';
                upsellAddBtn.style.background = '#25D366';
                setTimeout(() => {
                    upsellAddBtn.innerHTML = originalText;
                    upsellAddBtn.style.background = 'var(--primary)';
                }, 1500);
            }
        });
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartCount();
        renderCart();
    }

    function startCartTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            if (timerTime <= 0) {
                clearInterval(timerInterval);
                if (timerCountdown) timerCountdown.textContent = "00:00";
                return;
            }
            timerTime--;
            const m = Math.floor(timerTime / 60).toString().padStart(2, '0');
            const s = (timerTime % 60).toString().padStart(2, '0');
            if (timerCountdown) timerCountdown.textContent = `${m}:${s}`;
        }, 1000);
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
            mensaje += `🛒 ${i+1}. *${item.name}* (Talla ${item.size || 'Única'}) - ${formatCurrency(item.price)}\n`;
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
    // 4. IMAGE LIGHTBOX (PREMIUM VIEW)
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxPrice = document.getElementById('lightbox-price');
    const lightboxBuyBtn = document.getElementById('lightbox-buy-btn');
    const productCardsLight = document.querySelectorAll('.premium-card');

    const lightboxSizesContainer = document.getElementById('lightbox-sizes');
    let currentSelectedSize = null;

    // Función para renderizar las tallas del producto en el lightbox
    function renderLightboxSizes(sizesString) {
        if (!lightboxSizesContainer) return;
        lightboxSizesContainer.innerHTML = '';
        currentSelectedSize = null;

        if (!sizesString) {
            // Sin tallas definidas, mostrar "Talla Única"
            lightboxSizesContainer.innerHTML = '<span class="size-option selected">Única</span>';
            currentSelectedSize = 'Única';
            return;
        }

        const sizes = sizesString.split(',').map(s => s.trim());
        let firstAvailable = true;

        sizes.forEach(size => {
            const span = document.createElement('span');
            span.classList.add('size-option');
            span.textContent = size;

            // La primera talla disponible se selecciona por defecto
            if (firstAvailable) {
                span.classList.add('selected');
                currentSelectedSize = size;
                firstAvailable = false;
            }

            span.addEventListener('click', () => {
                lightboxSizesContainer.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                span.classList.add('selected');
                currentSelectedSize = size;
            });

            lightboxSizesContainer.appendChild(span);
        });
    }

    // Función reutilizable para abrir el lightbox desde cualquier parte de la tarjeta
    function openLightboxFromCard(card) {
        const img = card.querySelector('.product-image');
        const titleEl = card.querySelector('.card-details h4');
        const priceEl = card.querySelector('.price');
        const buyBtnOriginal = card.querySelector('.buy-btn');

        if (lightboxImg && lightbox && img) {
            if (!lightbox.classList.contains('active')) {
                history.pushState({ modalOpen: true }, "");
            }
            lightboxImg.src = img.src;
            
            if (lightboxTitle && titleEl) lightboxTitle.textContent = titleEl.textContent;
            if (lightboxPrice && priceEl) lightboxPrice.textContent = priceEl.textContent;
            
            if (lightboxBuyBtn && buyBtnOriginal) {
                lightboxBuyBtn.setAttribute('data-product', buyBtnOriginal.getAttribute('data-product'));
                lightboxBuyBtn.setAttribute('data-price', buyBtnOriginal.getAttribute('data-price'));
                lightboxBuyBtn.setAttribute('data-img', buyBtnOriginal.getAttribute('data-img'));
            }

            // Renderizar tallas individuales del producto
            const sizesData = buyBtnOriginal ? buyBtnOriginal.getAttribute('data-sizes') : null;
            renderLightboxSizes(sizesData);

            lightbox.classList.add('active');
        }
    }

    productCardsLight.forEach(card => {
        const img = card.querySelector('.product-image');
        const cardDetails = card.querySelector('.card-details');
        
        // Abrir lightbox al hacer click en la imagen
        if (img) {
            img.addEventListener('click', () => openLightboxFromCard(card));
        }

        // Abrir lightbox al hacer click en "Ver Detalles"
        if (cardDetails) {
            cardDetails.addEventListener('click', () => openLightboxFromCard(card));
        }
    });

    const closeLightbox = () => {
        if (lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            if (history.state && history.state.modalOpen) {
                history.back();
            }
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    if (lightboxBuyBtn) {
        lightboxBuyBtn.addEventListener('click', () => {
            const product = {
                name: lightboxBuyBtn.getAttribute('data-product'),
                price: parseInt(lightboxBuyBtn.getAttribute('data-price')),
                img: lightboxBuyBtn.getAttribute('data-img'),
                size: currentSelectedSize || 'Única',
                id: Date.now()
            };

            cart.push(product);
            updateCartCount();
            closeLightbox();
            openCart();
            
            const originalText = lightboxBuyBtn.innerHTML;
            lightboxBuyBtn.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
            lightboxBuyBtn.style.background = '#25D366';
            setTimeout(() => {
                lightboxBuyBtn.innerHTML = originalText;
                lightboxBuyBtn.style.background = '';
            }, 1500);
        });
    }

    // ==========================================
    // 5. CATEGORY FILTER TABS
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.premium-card[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach((card, i) => {
                const category = card.getAttribute('data-category');
                const matches = filter === 'all' || category === filter;

                if (matches) {
                    card.classList.remove('hidden');
                    card.classList.remove('filter-animate');
                    void card.offsetWidth; // fuerza reflow para reiniciar animación
                    card.style.animationDelay = (i * 0.04) + 's';
                    card.classList.add('filter-animate');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('filter-animate');
                }
            });
        });
    });

    // ==========================================
    // 6. SOCIAL PROOF POPUP
    // ==========================================
    const sppPopup = document.getElementById('social-proof-popup');
    const sppClose = document.getElementById('spp-close');
    const sppImg = document.getElementById('spp-img');
    const sppName = document.getElementById('spp-name');
    const sppCity = document.getElementById('spp-city');
    const sppProductName = document.getElementById('spp-product-name');
    const sppTimeAgo = document.getElementById('spp-time-ago');

    const names = ['Valentina', 'Camila', 'Andrea', 'Sofía', 'Mariana', 'Isabella', 'Luciana', 'Daniela'];
    const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Pereira'];
    
    // Extraer productos del DOM (esto garantiza que los productos mostrados sean reales)
    function getRandomProduct() {
        const cards = document.querySelectorAll('.premium-card .product-image');
        if (!cards || cards.length === 0) return null;
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        return {
            name: randomCard.getAttribute('alt'),
            img: randomCard.getAttribute('src')
        };
    }

    function showSocialProof() {
        if (!sppPopup) return;
        
        const product = getRandomProduct();
        if (!product) return;

        sppImg.src = product.img;
        sppProductName.textContent = product.name;
        sppName.textContent = names[Math.floor(Math.random() * names.length)];
        sppCity.textContent = cities[Math.floor(Math.random() * cities.length)];
        sppTimeAgo.textContent = Math.floor(Math.random() * 59) + 1;

        sppPopup.classList.add('show');

        // Ocultar después de 5 segundos
        setTimeout(() => {
            sppPopup.classList.remove('show');
        }, 5000);
    }

    if (sppClose) {
        sppClose.addEventListener('click', () => sppPopup.classList.remove('show'));
    }

    // Mostrar el primer popup entre 5 y 10 segundos después de cargar la página
    setTimeout(() => {
        showSocialProof();
        // Mostrar recurrentemente cada 20 a 40 segundos
        setInterval(() => {
            if (Math.random() > 0.3) { // 70% de probabilidad de que salga
                showSocialProof();
            }
        }, Math.floor(Math.random() * 20000) + 20000);
    }, Math.floor(Math.random() * 5000) + 5000);

});
