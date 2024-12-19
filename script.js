let cart = [];
        let products = [];
        let filteredProducts = [];
    
        async function fetchProducts() {
            const query = document.getElementById('search').value;
            const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
            const data = await response.json();
            products = data.products;
            filteredProducts = [...products]; // Initialize filtered products
            displayProducts(filteredProducts);
        }
    
        function displayProducts(productList) {
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = '';
            if (productList.length === 0) {
                productsContainer.innerHTML = `<p>No products found</p>`;
                return;
            }
            productList.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <h2>${product.title}</h2>
                    <p>Price: ₹${product.price}</p>
                    <p>Brand: ${product.brand}</p>
                    <p>Category: ${product.category}</p>
                    <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
                `;
                productsContainer.appendChild(productElement);
            });
        }
    
        function applyFilters() {
            const priceFilter = document.getElementById('priceFilter').value;
            const brandFilter = document.getElementById('brandFilter').value;
            const categoryFilter = document.getElementById('categoryFilter').value;
    
            // Start with all products
            filteredProducts = [...products];
    
            // Apply brand filter if selected
            if (brandFilter) {
                filteredProducts = filteredProducts.filter(product => product.brand === brandFilter);
            }
    
            // Apply category filter if selected
            if (categoryFilter) {
                filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
            }
    
            // Apply price filter if selected
            if (priceFilter === 'low') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (priceFilter === 'high') {
                filteredProducts.sort((a, b) => b.price - a.price);
            }
    
            // Display the filtered products
            displayProducts(filteredProducts);
        }
    
        function addToCart(id, title, price) {
            const item = cart.find(product => product.id === id);
            if (item) {
                item.quantity++;
            } else {
                cart.push({ id, title, price, quantity: 1 });
            }
            updateCart();
        }
    
        function updateCart() {
            const cartItemsContainer = document.getElementById('cartItems');
            const cartCounter = document.getElementById('cartCounter');
            const cartSummary = document.getElementById('cartSummary');
    
            cartItemsContainer.innerHTML = '';
            let total = 0;
            let itemCount = 0;
    
            cart.forEach(item => {
                total += item.price * item.quantity;
                itemCount += item.quantity;
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <span>${item.title} (x${item.quantity})</span>
                    <span>₹${item.price * item.quantity}</span>
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
    
            cartSummary.textContent = `Total: ₹${total}`;
            cartCounter.textContent = itemCount;
        }
    
        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }
    
        function toggleCartModal() {
            const cartModal = document.getElementById('cartModal');
            cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
        }
    
        function buyNow() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            cart = [];
            updateCart();
            toggleCartModal();
            alert('Your order has been placed successfully!');
        }