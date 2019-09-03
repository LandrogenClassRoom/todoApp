const API_URL = 'http://localhost:3000';

const API = {
	/**
	 * Получение всех задач
	 * @returns {Promise<any>}
	 */
	getAllTodo() {
		return fetch(`${API_URL}/todo`).then(response => response.json());
	},

	/**
	 * Добавление новой задачи
	 * @param todo
	 * @returns {Promise<any>}
	 */
	addTodo(todo) {
		return fetch(`${API_URL}/todo`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(todo),
		}).then(response => response.json());
	},
	/**
	 * Обновленеие задачи
	 * @param todo
	 * @returns {Promise<any>}
	 */
	updateTodo(todo) {
		return fetch(`${API_URL}/todo/${todo.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(todo),
		}).then(response => response.json());
	},
	/**
	 * Удаление задачи
	 * @param index
	 * @returns {Promise<any>}
	 */
	deleteTodo(index) {
		return fetch(`${API_URL}/todo/${index}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
		}).then(response => response.json());
	},
};

export default API;
