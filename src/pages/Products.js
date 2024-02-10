import React from 'react';

const Products = () => {
  const products = [
    { id: 1, name: 'Süt', price: 5 },
    { id: 2, name: 'Yoğurt', price: 3 },
    { id: 3, name: 'Peynir', price: 8 },
  ];

  return (
    <div>
      <h1>Ürünlerimiz</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - {product.price} TL
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;