// Mobile nav toggle
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("header nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }
});

// ---- Product catalog ----
// Loaded from the Prism Websites CMS (Directus) so the shop owner can add/edit
// products, prices, and photos from a simple login instead of editing code.
var DIRECTUS_URL = "https://directus-production-0caa.up.railway.app";
var PRODUCTS = [];

var emberOakReady = fetch(DIRECTUS_URL + "/items/products?fields=id,name,scent,description,price,photo")
  .then(function (res) {
    return res.json();
  })
  .then(function (json) {
    PRODUCTS = (json.data || []).map(function (p) {
      return {
        id: String(p.id),
        name: p.name,
        scent: p.scent,
        price: parseFloat(p.price),
        desc: p.description,
        image: p.photo ? DIRECTUS_URL + "/assets/" + p.photo : ""
      };
    });
  })
  .catch(function () {
    PRODUCTS = [];
  });

function getProduct(id) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) return PRODUCTS[i];
  }
  return null;
}

// ---- Cart (localStorage) ----
var CART_KEY = "emberoak_cart";

function getCart() {
  try {
    var raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id, qty) {
  qty = qty || 1;
  var cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
  renderCart();
  openCart();
}

function setQty(id, qty) {
  var cart = getCart();
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  var cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function cartCount() {
  var cart = getCart();
  var total = 0;
  for (var id in cart) total += cart[id];
  return total;
}

function cartSubtotal() {
  var cart = getCart();
  var total = 0;
  for (var id in cart) {
    var product = getProduct(id);
    if (product) total += product.price * cart[id];
  }
  return total;
}

function money(n) {
  return "$" + n.toFixed(2);
}

// ---- Rendering ----
function renderProductGrid(containerId, ids) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var list = ids ? ids.map(getProduct) : PRODUCTS;
  container.innerHTML = list
    .map(function (p) {
      return (
        '<div class="product-card">' +
        '<div class="product-thumb"><img src="' + p.image + '" alt="' + p.name + ' candle" width="240" height="300" /></div>' +
        '<div class="product-body">' +
        '<div class="product-scent">' + p.scent + "</div>" +
        "<h3>" + p.name + "</h3>" +
        "<p>" + p.desc + "</p>" +
        '<div class="product-footer">' +
        '<span class="product-price">' + money(p.price) + "</span>" +
        '<button class="add-to-cart" data-id="' + p.id + '">Add to Cart</button>' +
        "</div></div></div>"
      );
    })
    .join("");

  container.querySelectorAll(".add-to-cart").forEach(function (btn) {
    btn.addEventListener("click", function () {
      addToCart(btn.getAttribute("data-id"), 1);
      var original = btn.textContent;
      btn.textContent = "Added!";
      btn.classList.add("added");
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove("added");
      }, 1200);
    });
  });
}

function renderCart() {
  var count = cartCount();
  document.querySelectorAll(".cart-count").forEach(function (el) {
    el.textContent = count;
  });

  var itemsEl = document.getElementById("cart-items");
  var footerEl = document.getElementById("cart-footer");
  if (!itemsEl) return;

  var cart = getCart();
  var ids = Object.keys(cart);

  if (ids.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.<br />Add a candle to get started.</div>';
    if (footerEl) footerEl.style.display = "none";
    return;
  }

  if (footerEl) footerEl.style.display = "block";

  itemsEl.innerHTML = ids
    .map(function (id) {
      var p = getProduct(id);
      if (!p) return "";
      var qty = cart[id];
      return (
        '<div class="cart-item">' +
        '<img src="' + p.image + '" alt="' + p.name + '" />' +
        '<div class="cart-item-body">' +
        "<h4>" + p.name + "</h4>" +
        '<div class="cart-item-meta">' +
        '<div class="qty-controls">' +
        '<button data-action="dec" data-id="' + id + '">-</button>' +
        '<span>' + qty + '</span>' +
        '<button data-action="inc" data-id="' + id + '">+</button>' +
        '</div>' +
        '<span>' + money(p.price * qty) + '</span>' +
        '</div>' +
        '<button class="cart-item-remove" data-action="remove" data-id="' + id + '">Remove</button>' +
        '</div></div>'
      );
    })
    .join("");

  itemsEl.querySelectorAll("button[data-action]").forEach(function (btn) {
    var id = btn.getAttribute("data-id");
    var action = btn.getAttribute("data-action");
    btn.addEventListener("click", function () {
      var cart = getCart();
      if (action === "inc") setQty(id, (cart[id] || 0) + 1);
      if (action === "dec") setQty(id, (cart[id] || 0) - 1);
      if (action === "remove") removeFromCart(id);
    });
  });

  var subtotalEl = document.getElementById("cart-subtotal-amount");
  if (subtotalEl) subtotalEl.textContent = money(cartSubtotal());
}

// ---- Cart drawer open/close ----
function openCart() {
  var drawer = document.getElementById("cart-drawer");
  var overlay = document.getElementById("cart-overlay");
  if (drawer) drawer.classList.add("open");
  if (overlay) overlay.classList.add("open");
}

function closeCart() {
  var drawer = document.getElementById("cart-drawer");
  var overlay = document.getElementById("cart-overlay");
  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
}

// ---- Checkout modal (simulated) ----
function openCheckout() {
  if (cartCount() === 0) return;
  var modal = document.getElementById("checkout-modal");
  var summary = document.getElementById("checkout-summary");
  if (summary) summary.textContent = cartCount() + " item(s), subtotal " + money(cartSubtotal());
  if (modal) modal.classList.add("open");
}

function closeCheckout() {
  var modal = document.getElementById("checkout-modal");
  if (modal) modal.classList.remove("open");
}

function placeDemoOrder() {
  saveCart({});
  renderCart();
  var modal = document.getElementById("checkout-modal");
  if (!modal) return;
  modal.querySelector(".modal-body").innerHTML =
    '<div class="modal-icon">&#127881;</div>' +
    "<h2>Demo order placed!</h2>" +
    '<p>This is a simulated checkout for demo purposes &mdash; no payment was processed and no card was charged.</p>' +
    '<div class="modal-demo-note">On a real Ember &amp; Oak build, this step would hand off to Stripe Payment Links or Snipcart for real payment processing, order confirmation emails, and a real order in the shop owner\'s dashboard.</div>' +
    '<div class="modal-actions"><button class="btn btn-full" onclick="closeCheckout()">Close</button></div>';
}

document.addEventListener("DOMContentLoaded", function () {
  emberOakReady.then(renderCart);

  var cartBtns = document.querySelectorAll(".cart-btn");
  cartBtns.forEach(function (btn) {
    btn.addEventListener("click", openCart);
  });

  var closeBtn = document.getElementById("cart-close");
  if (closeBtn) closeBtn.addEventListener("click", closeCart);

  var overlay = document.getElementById("cart-overlay");
  if (overlay) overlay.addEventListener("click", closeCart);

  var checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);

  var checkoutClose = document.getElementById("checkout-close");
  if (checkoutClose) checkoutClose.addEventListener("click", closeCheckout);

  var checkoutOverlay = document.getElementById("checkout-modal");
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener("click", function (e) {
      if (e.target === checkoutOverlay) closeCheckout();
    });
  }

  var placeOrderBtn = document.getElementById("place-order-btn");
  if (placeOrderBtn) placeOrderBtn.addEventListener("click", placeDemoOrder);
});

// ---- Contact form (Web3Forms, real submission) ----
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var status = form.querySelector(".form-status");
    var formData = new FormData(form);
    status.textContent = "Sending...";
    status.style.color = "";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.success) {
          status.textContent = "Thanks! We'll get back to you within a day.";
          status.style.color = "#4a7a4f";
          form.reset();
        } else {
          status.textContent = "Something went wrong. Please try again.";
          status.style.color = "#c1502e";
        }
      })
      .catch(function () {
        status.textContent = "Something went wrong. Please try again.";
        status.style.color = "#c1502e";
      });
  });
});

// ---- Site info (contact email/phone/hours from the CMS) ----
document.addEventListener("DOMContentLoaded", function () {
  var infoEl = document.getElementById("site-contact-info");
  if (!infoEl) return;

  function row(label, value, isEmail) {
    if (!value) return;
    var div = document.createElement("div");
    var strong = document.createElement("strong");
    strong.textContent = label + ": ";
    div.appendChild(strong);
    if (isEmail) {
      var a = document.createElement("a");
      a.href = "mailto:" + value;
      a.textContent = value;
      div.appendChild(a);
    } else {
      var span = document.createElement("span");
      span.style.whiteSpace = "pre-line";
      span.textContent = value;
      div.appendChild(span);
    }
    infoEl.appendChild(div);
  }

  fetch(DIRECTUS_URL + "/items/site_info")
    .then(function (res) {
      return res.json();
    })
    .then(function (json) {
      var info = json.data || {};
      row("Email", info.contact_email, true);
      row("Phone", info.contact_phone);
      row("Hours", info.hours);
    })
    .catch(function () {});
});
