import React from 'react';
import './styles.css';

class GetFile extends React.Component {

    handleDownload = async () => {
        try {
            const response = await fetch('http://localhost:8000/get/get_data', {
                method: 'GET',
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'data.json');
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
            } else {
                throw new Error("Ошибка при скачивании файла");
            }
        } catch (error: any) {
            alert(error.message);
        }
    }

    render() {
        return (
            <div className="wrapper">
                <h2>Скачать базу марок</h2>
                <button className="download-button" onClick={this.handleDownload}>
                    Скачать
                </button>
            </div>
        )
    }
}

export default GetFile;