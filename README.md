# Web Storage Demo
Simple page demonstrating the use of Web Storage

## Usage
- Clicking on a product card from the main products grid will:
  - Hide the product from the main products grid
  - Add the product to the beginning of the cart
  - Increase the cart's count number
- Clicking on the cart icon in the header will display a modal of all the items in the cart
- Clicking on a product card in the cart modal will:
  - Remove the product from the cart grid
  - Show the product where it originally appeared in the products grid
  - Decrease the cart's count number

## Gotchas
Due to cross origin requests policies, this demo site will not work in Chrome since it is attempting to load the JSON file from the local directory instead of a web server.