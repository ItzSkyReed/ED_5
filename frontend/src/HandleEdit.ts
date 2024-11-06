async function handleEdit(
    id: number,
    model: string,
    brand: string,
    type: string,
    desc: string,
    country: string,
    date: number | null
): Promise<boolean> {
    const formattedDate = date ? new Date(date * 1000).toISOString().split('T')[0] : null;

    const data = {
        id,
        model,
        brand,
        type,
        desc,
        country,
        date: formattedDate
    };

    try {
        const response = await fetch(`http://localhost:8000/put/change_model_db`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.status === 200) {
            alert('Успешно отредактировано');
            return true;
        } else if (response.status === 400) {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error || 'Некорректные данные'}`);
            return false;
        } else {
            alert('Произошла неизвестная ошибка. Попробуйте снова.');
            return false;
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        alert('Ошибка сети. Проверьте подключение и попробуйте снова.');
        return false;
    }
}

export default handleEdit;
