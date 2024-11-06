export default class FormHandler {
    private static createJSON(data: any): string {
        return JSON.stringify(data);
    }

    public static async sendFormData(data: any, saveOption: 'database' | 'file'): Promise<void> {
        const jsonData = this.createJSON(data);

        // Выбор URL в зависимости от метода сохранения
        const url =
            saveOption === 'database'
                ? 'http://localhost:8000/post/send_json_db'
                : 'http://localhost:8000/post/send_json_file';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
            });

            if (response.ok) {
                alert("Успешная отправка!");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Ошибка отправки");
            }
        } catch (error: any) {
            alert(error.message);
        }
    }
}