import { data } from "/data.js";
const productListEl = document.querySelector(".card-container");
const qtyEl = document.querySelector(".qty");
const itemsEl = document.querySelector(".items");
const emptyCartMessage = `<div class='empty-message'>
  <img src='./assets/images/illustration-empty-cart.svg' />
  Your added items will appear here
</div>`;
const totalAmountEl = document.createElement("div");
totalAmountEl.classList.add("total-amount");
totalAmountEl.innerHTML = "Total: $0"; // Initial total amount
itemsEl.after(totalAmountEl); // Add total amount element below cart items

let totalQty = 0;
let totalAmount = 0;

// Display "no cart" message when cart is empty
function updateEmptyCartMessage() {
  if (totalQty === 0) {
    itemsEl.innerHTML = emptyCartMessage;
    totalAmountEl.innerHTML = "Total: $0"; // Reset total amount
  } else {
    const existingMessage = itemsEl.querySelector(".empty-message");
    if (existingMessage) {
      existingMessage.remove();
    }
  }
}

// Update the total amount of all cart items
function updateTotalAmount() {
  totalAmountEl.innerHTML = `Total: $${totalAmount.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  data.forEach((element, index) => {
    let images;
    let qty = 0;

    // Set initial add-to-cart button or quantity display
    let addToCart = `<img src='./assets/images/icon-add-to-cart.svg' alt='cart' />
      <span class="add-to-cart" >Add to Cart</span>`;

    const product = `<div class="cart">
      <img src="${images}" alt='${images}' class='image' />
      <div class="overlay" data-index="${index}">
      ${addToCart}
      </div>
      <p class="category">${element.category}</p>
      <h2 class="product">${element.name}</h2>
      <span class="price">$${element.price}</span>
      </div>`;

    // Insert product HTML into the container
    productListEl.insertAdjacentHTML("beforeend", product);

    const imageEl = productListEl.querySelectorAll(".image")[index];
    const cartEl = productListEl.querySelectorAll(".overlay")[index];
    const addToCartEl = productListEl.querySelectorAll(".add-to-cart")[index];

    // Click event for the add-to-cart functionality
    addToCartEl.onclick = () => {
      addToCartFunc(cartEl, qtyEl);
    };

    const addToCartFunc = (cartElement, qtyElement) => {
      // Remove empty cart message when adding an item
      updateEmptyCartMessage();
      itemsEl.querySelector('.empty-message')?.remove(); 

      qty++;
      totalQty++;
      totalAmount += element.price; // Update total amount

      cartElement.innerHTML = 
      `<div class="cart_qty">
        <img class="increment" src='./assets/images/icon-increment-quantity.svg' alt='plus' />
          <span class="qty" >
          ${qty}
          </span>
        <img class="decrement" src='./assets/images/icon-decrement-quantity.svg' alt='minus' />
      </div>`;
      qtyElement.innerHTML = totalQty;
      cartEl.style = "background-color:hsl(24, 100%, 37%)";

      let itemDetails =
       `<div class='qty_items'>
          <div class='details'>
            <h3 class='product_title'>${element.name}</h3>
            <span class='price_details'>
                <p class='qty_details'>${qty}x</p>
                <p>@${element.price} <span class='total_price'>$${element.price * qty}</span></p>
              </span>
          </div>
          <button class="remove-item-btn">
            <img src='/assets/images/icon-remove-item.svg' alt='remove' />
          </button>
        </div>`;

      // Insert item details into the cart
      itemsEl.insertAdjacentHTML("beforeend", itemDetails);

      const increment = cartElement.querySelector(".increment");
      const decrement = cartElement.querySelector(".decrement");

      const currentElement = itemsEl.lastElementChild;
      const details_qty = currentElement.querySelector(".qty_details");
      const details_price = currentElement.querySelector(".total_price");
      const remove_btnEl = currentElement.querySelector(".remove-item-btn");

      // Remove button functionality
      remove_btnEl.onclick = () => {
        currentElement.remove(); // Remove the item from the cart
        totalQty -= qty;
        totalAmount -= element.price * qty; // Decrease total amount
        qty = 0; // Set the item quantity to 0
        cartElement.querySelector(".qty").innerText = qty; // Update the product qty display
        qtyElement.innerHTML = totalQty; // Update the total quantity display
        updateEmptyCartMessage(); // Check if the cart is empty and update the message
        updateTotalAmount(); // Update the total amount
      };

      increment.onclick = () => {
        incrementFun(cartElement, details_price, details_qty);
      };

      decrement.onclick = () => {
        decrementFun(cartElement, details_price, details_qty);
      };

      function incrementFun(cartElement, dp, dq) {
        if (qty >= 0) {
          qty++;
          totalQty++;
          totalAmount += element.price; // Increase total amount
          cartElement.querySelector(".qty").innerText = qty;
          qtyEl.innerHTML = totalQty;
          dp.innerText = `$${element.price * qty}`;
          dq.innerText = `${qty}x`;
          updateTotalAmount(); // Update the total amount
        }
      }

      function decrementFun(cartElement, dp, dq) {
        if (qty > 0) {
          qty--;
          totalQty--;
          totalAmount -= element.price; // Decrease total amount
          cartElement.querySelector(".qty").innerText = qty;
          qtyEl.innerHTML = totalQty;
          dp.innerText = `$${element.price * qty}`;
          dq.innerText = `${qty}x`;

          if (qty === 0) {
            currentElement.remove(); // Remove item if qty reaches 0
            updateEmptyCartMessage(); // Check if the cart is empty and update the message
          }
          updateTotalAmount(); // Update the total amount
        }
      }

      updateTotalAmount(); // Update the total amount after adding item
    };

    const SetImage = () => {
      const size = window.innerWidth;

      switch (true) {
        case size <= 280:
          images = element.images.thumbnail;
          break;

        case size <= 375:
          images = element.image.mobile;
          break;

        case size <= 675:
          images = element.image.tablet;
          break;

        default:
          images = element.image.desktop;
          break;
      }

      imageEl.src = images;
    };

    SetImage();
    window.addEventListener("resize", SetImage);
  });

  // Initially display empty cart message if there are no items
  updateEmptyCartMessage();
});
