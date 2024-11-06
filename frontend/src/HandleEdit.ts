// HandleEdit.ts
async function handleEdit(
    id: number,
    model: string,
    brand: string,
    type: string,
    desc: string,
    country: string,
    date: number | null
): Promise<boolean> {  // Изменили тип на boolean
    // Преобразуем Unix-время в строку формата YYYY-MM-DD, если date задан
    const formattedDate = date ? new Date(date * 1000).toISOString().split('T')[0] : null;

    // Создаем JSON структуру данных для отправки
    const data = {
        id,
        model,
        brand,
        type,
        desc,
        country,
        date: formattedDate  // Используем преобразованную дату
    };

    try {
        // Отправляем PUT запрос на сервер для обновления
        const response = await fetch(`http://localhost:8000/put/change_model_db`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Проверка ответа
        if (response.status === 200) {
            alert('Успешно отредактировано');
            return true;  // Возвращаем true, если успешное обновление
        } else if (response.status === 400) {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error || 'Некорректные данные'}`);
            return false;  // Возвращаем false в случае ошибки 400
        } else {
            alert('Произошла неизвестная ошибка. Попробуйте снова.');
            return false;  // Возвращаем false для других ошибок
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        alert('Ошибка сети. Проверьте подключение и попробуйте снова.');
        return false;  // Возвращаем false в случае ошибки сети
    }
}

export default handleEdit;
