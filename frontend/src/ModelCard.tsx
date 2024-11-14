import React, {Component} from 'react';
import './ModelCard.css';
import handleEdit from './HandleEdit';

const formatDate = (unixTimestamp: number | null): string => {
    if (!unixTimestamp) return 'Неизвестно';
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

interface Details {
    id?: number;
    brand: string;
    type: string;
    date: number | null;
    country: string;
    desc: string;
}

interface ModelCardProps {
    model: string;
    details: Details;
    onDelete: (id: number) => void; // Функция для уведомления родительского компонента об удалении
}

interface ModelCardState {
    isEditing: boolean;
    editableDetails: Details;
}

class ModelCard extends Component<ModelCardProps, ModelCardState> {
    constructor(props: ModelCardProps) {
        super(props);
        this.state = {
            isEditing: false,
            editableDetails: {...props.details}
        };
    }

    toggleEditMode = () => {
        this.setState((prevState) => ({
            isEditing: !prevState.isEditing,
            // Обновляем editableDetails при входе в режим редактирования, чтобы подгрузить актуальные данные из props
            editableDetails: !prevState.isEditing ? {...this.props.details} : prevState.editableDetails
        }));
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        this.setState((prevState) => ({
            editableDetails: {
                ...prevState.editableDetails,
                [name]: value
            }
        }));
    };

    handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const unixTimestamp = e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : null;
        this.setState((prevState) => ({
            editableDetails: {
                ...prevState.editableDetails,
                date: unixTimestamp
            }
        }));
    };

    saveChanges = async () => {
        const {id, brand, type, date, country, desc} = this.state.editableDetails;
        const {model} = this.props;

        if (id !== undefined) {
            const success = await handleEdit(id, model, brand, type, desc, country, date);

            if (success) {
                this.setState({
                    editableDetails: {
                        ...this.state.editableDetails,
                        brand,
                        type,
                        date,
                        country,
                        desc
                    },
                    isEditing: false // Выключаем режим редактирования
                });
            }
        }
    };

    deleteItem = async () => {
        const {id} = this.state.editableDetails;
        if (id !== undefined) {
            try {
                const response = await fetch(`http://localhost:8000/delete/delete_model_db`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id: id})
                });
                if (response.ok) {
                    this.props.onDelete(id);
                } else {
                    alert('Ошибка при удалении');
                }
            } catch (error) {
                alert('Ошибка при удалении');
            }
        }
    };

    render() {
        const {model} = this.props;
        const {isEditing, editableDetails} = this.state;
        const {id, brand, type, date, country, desc} = editableDetails;

        return (
            <div className="product-card">
                <h2 className="product-title">{model || 'Модель неизвестна'}</h2>
                {isEditing ? (
                    <>
                        <p><strong>Бренд:</strong> <input type="text" name="brand" value={brand} onChange={this.handleChange}/></p>
                        <p><strong>Тип:</strong> <input type="text" name="type" value={type} onChange={this.handleChange}/></p>
                        <p><strong>Дата выпуска:</strong>
                            <input
                                type="date"
                                name="date"
                                value={date ? new Date(date * 1000).toISOString().split('T')[0] : ''}
                                onChange={this.handleDateChange}
                            />
                        </p>
                        <p><strong>Страна:</strong> <input type="text" name="country" value={country} onChange={this.handleChange}/></p>
                        <p><strong>Описание:</strong>
                            <textarea name="desc" value={desc} onChange={this.handleChange}/></p>
                        <button className="save-button" onClick={this.saveChanges}>Сохранить</button>
                        <button className="delete-button" onClick={this.deleteItem}>Удалить</button>
                    </>
                ) : (
                    <>
                        <p><strong>Бренд:</strong> {brand || 'Неизвестно'}</p>
                        <p><strong>Тип:</strong> {type || 'Неизвестно'}</p>
                        <p><strong>Дата выпуска:</strong> {formatDate(date)}</p>
                        <p><strong>Страна:</strong> {country || 'Неизвестно'}</p>
                        <p><strong>Описание:</strong> <span className="description">{desc || 'Описание отсутствует'}</span></p>
                        {id !== undefined && (
                            <button className="edit-button" onClick={this.toggleEditMode}>Редактировать</button>
                        )}
                    </>
                )}
            </div>
        );
    }
}

export default ModelCard;
