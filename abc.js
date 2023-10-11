const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartCountInfo = document.getElementById('cart-count-info');
const cartTotalValue = document.getElementById('cart-total-value');
let cartItemID = 1;

eventListeners();

function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        fetchStorApi();
        loadCart();
    });
	document.getElementById('cart-btn').addEventListener('click', () => {
	    cartContainer.classList.toggle('show-cart-container');
	});
    productList.addEventListener('click', purchaseProduct);
    cartList.addEventListener('click', deleteCartItem);
}

function updateCartInfo(){
    let cartInfo = findCartInfo();

    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}
updateCartInfo();


function fetchStorApi(){
    fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data =>{
        let produects = data.map(product => {
            return  `
                <div class = "product-item">
                    <div class = "product-img">
                        <img src = "${product.image}" alt = "product image">
                        <button type = "button" class = "add-to-cart-btn">
                            <i class = "fa fa-shopping-cart"></i>Add To Cart
                        </button>
                    </div>
                    <div class = "product-content">
                        <h3 class = "product-name">${product.title}</h3>
                        <p class = "product-price">$${product.price}</p>
                        <span class = "product-category">${product.category}</span>
                    </div>
                </div>
            `;
        });
        produects = produects.join("");
        productList.innerHTML = produects;
    })
    .catch(error => {
        console.log(error);
    })
}

function purchaseProduct(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}

function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        category: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent
    }
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

function addToCartList(product){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
        <img src = "${product.imgSrc}" alt = "product image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${product.name}</h3>
            <span class = "cart-item-category">${product.category}</span>
            <span class = "cart-item-price">${product.price}</span>
        </div>

        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times"></i>
        </button>
    `;
    cartList.appendChild(cartItem);
}


function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
}


function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1; 
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
    }
    products.forEach(product => addToCartList(product));

    updateCartInfo();
}

function findCartInfo() {
    let products = getProductFromStorage();
    let total = products.reduce((prc, product)=>{
        let price = parseFloat(product.price.substr(1));
        return prc += price;
    }, 0);
    return {
        total: total.toFixed(2),
        productCount: products.length
    }    
}

function deleteCartItem(e){
    let cartItem;
    if (e.target.tagName === "BUTTON") {
        cartItem = e.target.parentElement;
        cartItem.remove();
    }else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove();
    }
    let products = getProductFromStorage();
    let updateProducts = products.filter(product =>{
        return product.id !== parseInt(cartItem.dataset.id);
    })   
    localStorage.setItem('products', JSON.stringify(updateProducts));
    updateCartInfo();
}