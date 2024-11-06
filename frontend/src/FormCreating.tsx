import React, {ChangeEvent} from 'react';
import './styles.css';
import FormHandler from "./FormHandler";

interface MarkFormState {
    brand: string;
    type: string;
    model: string;
    date: number | string;
    country: string;
    desc: string;
}

class MarkForm extends React.Component<{}, MarkFormState> {
    constructor(props: {}) {
        super(props);
        const currentDate = new Date();
        this.state = {
            brand: '',
            type: '',
            model: '',
            date: currentDate.toISOString().split('T')[0],
            country: '',
            desc: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange<T extends keyof MarkFormState>(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;

        this.setState({
            [name]: value,
        } as Pick<MarkFormState, T>);
    }

    async handleSubmit(event: React.MouseEvent<HTMLButtonElement>, saveOption: "database" | "file") {
        event.preventDefault();
        await FormHandler.sendFormData(this.state, saveOption);
    }

    render() {
        return (
            <div className="wrapper">
                <h2>Добавление техники в базу</h2>
                <form>
                    {/* Поля формы */}
                    <div className="form-group">
                        <label htmlFor="brand">Название Брэнда:</label>
                        <input
                            type="text"
                            id="brand"
                            name="brand"
                            value={this.state.brand}
                            maxLength={32}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Тип устройства:</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            value={this.state.type}
                            maxLength={32}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="model">Модель:</label>
                        <input
                            type="text"
                            id="model"
                            name="model"
                            value={this.state.model}
                            maxLength={64}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Дата выпуска:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={this.state.date}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Страна производитель:</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={this.state.country}
                            maxLength={64}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="desc">Дополнительное описание:</label>
                        <textarea
                            id="desc"
                            name="desc"
                            value={this.state.desc}
                            onChange={this.handleChange}
                            maxLength={2000}
                        />
                    </div>

                    {/* Кнопки для сохранения */}
                    <div className="button-group">
                        <button
                            type="button"
                            onClick={(event) => this.handleSubmit(event, 'database')}
                            className="save-button"
                        >
                            Сохранить в базу данных
                        </button>
                        <button
                            type="button"
                            onClick={(event) => this.handleSubmit(event, 'file')}
                            className="save-button"
                        >
                            Сохранить в файл
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default MarkForm;