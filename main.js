(function() {
  var products = {}
  var productsSort = []
  var storedProducts = []

  var initialize = function() {
    // fetch storage data
    let storedData = localStorage.getItem('stored-products') || ''
    if (storedData != '') {
      storedProducts = storedData.split('|')
    }

    // fetch JSON data
    let oReq = new XMLHttpRequest()
    oReq.overrideMimeType('application/json')
    oReq.open('GET', './products.json', true)
    oReq.send(null)
    oReq.onreadystatechange = function() {
      if (oReq.readyState == 4 && oReq.status == "200") {
        loadProducts(oReq.responseText)
      }
    }
  }

  var loadProducts = function(data) {
    let rawData = JSON.parse(data)
    let productsData = {}

    rawData.groups.map(function(product) {
      // set sort array
      productsSort.push(product.id)
      // determine selling and regular prices
      let sellingPrice = ''
      let regularPrice = ''
      if (product.priceRange != undefined) {
        if (product.priceRange.selling != undefined) {
          sellingPrice = '$' + product.priceRange.selling.high
        }
        if (product.priceRange.regular != undefined) {
          regularPrice = '$' + product.priceRange.regular.high
        }
      } else if (product.price != undefined) {
        if (product.price.selling != undefined) {
          sellingPrice = '$' + product.price.selling
        }
        if (product.price.regular != undefined) {
          regularPrice = '$' + product.price.regular
        }
      }

      productsData[product.id] = {
        id: product.id,
        name: product.name,
        link: product.links.www,
        imageUrl: product.hero.href,
        sellingPrice: sellingPrice,
        regularPrice: regularPrice,
        isStored: storedProducts.includes(product.id)
      }
    })
    products = productsData
    renderProducts()
  }

  var renderProducts = function() {
    let productsGrid = document.querySelector('#products')
    let cartGrid = document.querySelector('#cartProducts')
    let cartItemsCount = document.querySelector('#cartItems')

    productsSort.map(function(p) {
      // append product to products grid
      let productCard = createProductCard(products[p], false)
      productsGrid.appendChild(productCard)
      productCard.onclick = addToCart

      if (products[p].isStored) {
        // hide product from products grid
        productCard.classList.add('hidden')
        // append product to cart grid
        let cartCard = createProductCard(products[p], true)
        cartGrid.appendChild(cartCard)
        cartCard.onclick = removeFromCart
      }
    })

    // display the number of items in the cart
    cartItemsCount.innerHTML = storedProducts.length
  }

  var createProductCard = function(product, forCart) {
    // create product card
    let productCard = document.createElement('div')
    productCard.id = (forCart ? 'cart-' : 'store-') + product.id
    productCard.dataset.id = product.id
    productCard.classList.add('productCard')
    // add product image to card
    let productImage = document.createElement('img')
    productImage.id = 'img-' + product.id
    productImage.src = product.imageUrl
    productCard.appendChild(productImage)
    // add product text to card
    let productDescription = document.createElement('div')
    productDescription.id = 'descr-' + product.id
    productDescription.className = 'description'
    let productName = document.createElement('h3')
    let productNameText = document.createTextNode(product.name)
    productName.appendChild(productNameText)
    productDescription.appendChild(productName)
    let productPrice = document.createElement('p')
    let productPriceText = document.createTextNode('price: ' + product.sellingPrice)
    productPrice.className = 'price'
    productPrice.appendChild(productPriceText)
    if (product.regularPrice != '') {
      let regularPrice = document.createElement('span')
      let regularPriceText = document.createTextNode('reg: ' + product.regularPrice)
      regularPrice.className = 'regularPrice'
      regularPrice.appendChild(regularPriceText)
      productPrice.appendChild(regularPrice)
    }
    productDescription.appendChild(productPrice)
    productCard.appendChild(productDescription)

    return productCard
  }

  var addToCart = function() {
    let cartGrid = document.querySelector('#cartProducts')
    let cartItemsCount = document.querySelector('#cartItems')
    let productId = this.dataset.id
    let idx = storedProducts.indexOf(productId)
    if (idx < 0) {
      // add and store product id to the beginning of the cart
      storedProducts.unshift(productId)
      localStorage.setItem('stored-products', storedProducts.join('|'))
      cartItemsCount.innerHTML = storedProducts.length
      // add product card to the beginning of the cart grid
      products[productId].isStored = true
      let cartCard = createProductCard(products[productId], true)
      cartGrid.insertBefore(cartCard, cartGrid.childNodes[0])
      cartCard.onclick = removeFromCart
      // hide product from products grid
      let thisProduct = document.querySelector('#store-' + productId)
      thisProduct.classList.add('hidden')
    }
  }

  var removeFromCart = function() {
    let cartGrid = document.querySelector('#cartProducts')
    let cartItemsCount = document.querySelector('#cartItems')
    let productId = this.dataset.id
    let idx = storedProducts.indexOf(productId)
    if (idx >= 0) {
      // remove product card from the cart
      products[productId].isStored = false
      storedProducts.splice(idx, 1)
      localStorage.setItem('stored-products', storedProducts.join('|'))
      cartItemsCount.innerHTML = storedProducts.length
      // show product in products grid
      let thisProduct = document.querySelector('#store-' + productId)
      thisProduct.classList.remove('hidden')
      // remove product from cart grid
      let cartCard = document.querySelector('#cart-' + productId)
      cartCard.parentNode.removeChild(cartCard)
    }
  }

  // opens the cart grid
  document.querySelector('#cart').addEventListener('click', function(e) {
    e.preventDefault()
    document.querySelector('#modal').classList.add('open')
  })

    // closes the cart grid
    document.querySelector('#closeModal').addEventListener('click', function(e) {
      e.preventDefault()
      document.querySelector('#modal').classList.remove('open')
    })

  // scrolls page back to top
  document.querySelector('#scrollToTop').addEventListener('click', function(e) {
    e.preventDefault()
    window.scroll(0, 0)
  })

  initialize()
})()