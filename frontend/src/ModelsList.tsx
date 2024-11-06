import React, {useEffect, useState} from 'react';
import ModelCard from './ModelCard';
import './styles.css';

type Props = {
    source: 'file' | 'database';
};

const ModelsList: React.FC<Props> = ({source}) => {
    const [products, setProducts] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            let url = '';

            if (source === 'file') {
                url = 'http://localhost:8000/get/get_data_content';
            } else if (source === 'database') {
                url = `http://localhost:8000/get/get_filtered_models?query=${searchQuery}`;
            }

            try {
                const response = await fetch(url);
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

        fetchData();
    }, [source, searchQuery]);

    const handleDelete = (id: number) => {
        setProducts((prevProducts) => {
            return Object.fromEntries(
                Object.entries(prevProducts).filter(([key, value]) => value.id !== id)
            );
        });
    };

    if (loading) return <p>Загрузка данных...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div className="product-list">
            {source === 'database' && (
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            )}
            {Object.keys(products).length > 0 ? (
                Object.entries(products).map(([model, details]) => (
                    <ModelCard key={model} model={model} details={details} onDelete={details.id ? () => handleDelete(details.id) : () => {
                    }}/>
                ))
            ) : (
                <p>Нет данных для отображения</p>
            )}
        </div>
    );
};

export default ModelsList;
