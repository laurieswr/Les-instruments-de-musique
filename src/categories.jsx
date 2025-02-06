import React, { useState, useEffect } from 'react';

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <ul>
      {categories.map(category => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
}