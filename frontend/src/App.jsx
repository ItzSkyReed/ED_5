import React, { useState } from 'react';
import './App.css';
import MarkForm from "./FormCreating";
import FileLoading from "./FileLoading";
import GetFile from "./GetFile";
import Header from './Header';
import ModelsList from "./ModelsList";

function App() {
    const [activePage, setActivePage] = useState('main');

const renderPage = () => {
    switch (activePage) {
        case 'main':
            return <MarkForm />;
        case 'database':
            return null;
        case 'file':
            return (
                <>
                    <GetFile />
                    <FileLoading />
                    <h1>Список Моделей</h1>
                    <ModelsList />
                </>
            );
        default:
            return <MarkForm />;
    }
};

    return (
        <div className="App">
            <Header onPageChange={setActivePage} activePage={activePage} />
            <h1>Марки Техники</h1>
            {renderPage()}
        </div>
    );
}

export default App;