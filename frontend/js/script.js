
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
    const countElement = document.getElementById("cart-count");

    if (countElement) {
        const count = cart.reduce(
            (total, item) => total + item.quantity, 0
        );

        countElement.textContent = count;
    }
}

// Add items to cart
document.querySelectorAll(".add-btn").forEach(button => {

    button.addEventListener("click", () => {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity: 1
            });
        }

        saveCart();
        updateCartCount();

        alert(name + " added to cart!");
    });

});

// Display cart items
function displayCart() {

    const cartContainer = document.getElementById("cart-items");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty!</h2>
                <p>Add some delicious food from our menu.</p>
                <br>
                <a href="menu.html" class="btn">Explore Menu</a>
            </div>
        `;
    }

    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div>
                <h3>${item.name}</h3>
                <p>₹${item.price} each</p>
            </div>

            <div class="quantity-controls">
                <button data-action="decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button data-action="increase" data-id="${item.id}">+</button>
            </div>

            <strong>₹${item.price * item.quantity}</strong>

            <button class="remove-btn"
                data-action="remove" data-id="${item.id}">
                Remove
            </button>
        `;

        cartContainer.appendChild(cartItem);
    });

    updateTotal();
}

// Calculate total
function updateTotal() {

    const totalElement = document.getElementById("cart-total");

    if (!totalElement) return;

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    totalElement.textContent = "₹" + total;
}

// Handle quantity and remove buttons
document.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    const item = cart.find(item => item.id === id);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }

    if (action === "remove") {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart();
    displayCart();
    updateCartCount();

});

// Initialize
displayCart();
updateCartCount();

/* Checkout Page */

// Display order summary
function displayCheckout() {

    const checkoutItems = document.getElementById("checkout-items");

    if (!checkoutItems) return;

    checkoutItems.innerHTML = "";

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    if (cart.length === 0) {
        checkoutItems.innerHTML = "<p>Your cart is empty.</p>";

        const button = document.querySelector(".place-order-btn");
        if (button) button.disabled = true;
    } else {
        cart.forEach(item => {

            const itemElement = document.createElement("div");

            itemElement.className = "checkout-item";

            itemElement.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <strong>₹${item.price * item.quantity}</strong>
            `;

            checkoutItems.appendChild(itemElement);
        });
    }

    document.getElementById("checkout-total").textContent =
        "₹" + total;
}

// Handle checkout form
const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const name = document.getElementById("customer-name").value;

        // Show order confirmation
        document.getElementById("checkout-form").hidden = true;
        document.querySelector(".order-summary").hidden = true;

        document.querySelector(".checkout-section > h1").hidden = true;
        document.querySelector(".checkout-description").hidden = true;

        document.getElementById("order-confirmation").hidden = false;

        document.getElementById("confirmation-message").textContent =
            "Thank you, " + name +
            "! Your demo order has been submitted successfully.";

        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();

    });
}

displayCheckout();
