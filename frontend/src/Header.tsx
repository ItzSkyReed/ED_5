import React from 'react';
import './App.css';

interface HeaderProps {
    onPageChange: (page: string) => void;
    activePage: string;
}

const Header: React.FC<HeaderProps> = ({ onPageChange, activePage }) => {
    return (
        <div className="header">
            <button
                className={`nav-button ${activePage === 'main' ? 'active' : ''}`}
                onClick={() => onPageChange('main')}
            >
                Главная
            </button>
            <button
                className={`nav-button ${activePage === 'database' ? 'active' : ''}`}
                onClick={() => onPageChange('database')}
            >
                Хранение в базе данных
            </button>
            <button
                className={`nav-button ${activePage === 'file' ? 'active' : ''}`}
                onClick={() => onPageChange('file')}
            >
                Хранение в файле
            </button>
        </div>
    );
};

export default Header;