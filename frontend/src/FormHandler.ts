export default class FormHandler {
    private static createJSON(data: any): string {
        return JSON.stringify(data);
    }

    public static async sendFormData(data: any, saveOption: 'database' | 'file'): Promise<boolean> {
        const jsonData = this.createJSON(data);

        const url =
            saveOption === 'database'
                ? 'http://localhost:8000/post/send_json_form_db'
                : 'http://localhost:8000/post/send_json_form';

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
                return true;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Ошибка отправки");
            }
        } catch (error: any) {
            alert(error.message);
            return false;
        }
    }
}
