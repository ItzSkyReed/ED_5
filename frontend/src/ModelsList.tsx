import React, { useEffect, useState } from 'react';
import ModelCard from './ModelCard';
import './styles.css';

const ModelsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/get/get_data_content');
        if (!response.ok) {
          throw new Error(`Ошибка при загрузке данных: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (err: any) {
        setError(`Не удалось загрузить данные: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData()
  }, []);

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className="product-list">
      {Object.keys(products).length > 0 ? (
        Object.entries(products).map(([model, details]) => (
          <ModelCard key={model} model={model} details={details} />
        ))
      ) : (
        <p>Нет данных для отображения</p>
      )}
    </div>
  );
};

export default ModelsList;