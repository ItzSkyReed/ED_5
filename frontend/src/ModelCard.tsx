import React from 'react';
import './ModelCard.css'
// Вспомогательная функция для форматирования даты
const formatDate = (unixTimestamp: number | null): string => {
    if (!unixTimestamp) return 'Неизвестно'; // Проверка на случай отсутствия даты
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Интерфейсы для пропсов
interface Details {
    brand: string;
    type: string;
    date: number | null;
    country: string;
    desc: string;
}

interface ModelCardProps {
    model: string;
    details: Details;
}

// Карточка продукта
const ModelCard: React.FC<ModelCardProps> = ({ model, details }) => (
    <div className="product-card">
        <h2 className="product-title">{model || 'Модель неизвестна'}</h2>
        <p><strong>Бренд:</strong> {details.brand || 'Неизвестно'}</p>
        <p><strong>Тип:</strong> {details.type || 'Неизвестно'}</p>
        <p><strong>Дата выпуска:</strong> {formatDate(details.date ?? null)}</p>
        <p><strong>Страна:</strong> {details.country || 'Неизвестно'}</p>
        <p><strong>Описание:</strong> {details.desc || 'Описание отсутствует'}</p>
    </div>
);

export default ModelCard;