import React from 'react';
import './styles.css';

class FileLoading extends React.Component {
    private readonly fileInput: React.RefObject<HTMLInputElement>;

    constructor(props: any) {
        super(props);
        this.fileInput = React.createRef();
    }

    handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && files.length > 0) {
            const file = files[0];

            const formData = new FormData();
            formData.append('file', file); // 'file' — это имя, с которым сервер будет получать файл

            try {
                const response = await fetch('http://localhost:8000/post/send_json_file', {
                    method: 'POST',
                    body: formData,
                });
                console.log(response);

                if (response.ok) {
                    alert("Успешная Отправка!");
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }
            } catch (error: any) {
                alert(error.message);
            }
            if (this.fileInput.current) {
                this.fileInput.current.value = '';

            }
        }
    }

    render() {
        return (
            <div className="wrapper">
                <h2>Загрузить готовый файл с инф. о марке</h2>
                <input className="file-upload-button"
                       ref={this.fileInput}
                       type="file"
                       id="docpicker"
                       accept=".json"
                       onChange={this.handleFileChange}
                />
            </div>
        )
    }
}

export default FileLoading;