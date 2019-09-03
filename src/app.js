import Handlebars from 'handlebars';
import uuid from 'uuid';

class TodoApp {
	constructor(api) {
		this.api = api;
		this.todoItems = [];
		this.todoListContainer = document.getElementById('todo-list');
		this.addTodoForm = document.getElementById('todo-form');

		this.todoItemsTpl = this.initTpl();
		this.initHandlers();
		this.getAllTodoItems().then(() => this.renderItems());
	}

	initTpl() {
		const todoItemTpl = document.getElementById('todo-items').innerHTML;
		return Handlebars.compile(todoItemTpl);
	}

	/**
	 * Инициализация обработчиков событий
	 */
	initHandlers() {
		this.todoListContainer.addEventListener('click', e => {
			if (e.target && e.target.dataset.action) {
				e.preventDefault();
				const {action, id} = e.target.dataset;
				switch (action) {
				case 'delete':
					this.deleteTodo(id);
					break;
				case 'complete':
					this.changeStatus(id);
					break;
				default:
					break;
				}
			}
		});

		this.addTodoForm.addEventListener('submit', e => {
			e.preventDefault();

			const newTodo = {
				id: uuid(),
				dateTime: new Date().getTime(),
				text: this.addTodoForm.text.value,
				done: false,
			};

			this.api.addTodo(newTodo).then((newTodo) => {
				this.todoItems = [...this.todoItems, newTodo];
				this.renderItems();
			});

			this.addTodoForm.reset();
		});
	}

	/**
	 * получение всех задач с сервера
	 */
	getAllTodoItems() {
		return this.api.getAllTodo().then(items => this.todoItems = items);
	}

	/**
	 * рендер списка задач
	 */
	renderItems() {
		this.todoListContainer.innerHTML = this.todoItemsTpl({items: this.todoItems});
	}

	/**
	 * change status
	 * @param id
	 */
	changeStatus(id) {
		let updatedTodo = null;
		this.todoItems = this.todoItems.map(t => {
			if (t.id === id) {
				t.done = !t.done;
				updatedTodo = t;
			}
			return t;
		});

		if (updatedTodo) {
			this.api.updateTodo(updatedTodo).then(() => {
				this.renderItems();
			});
		}
	}

	/**
	 * удалить задачу
	 * @param id
	 */
	deleteTodo(id) {
		this.todoItems = this.todoItems.filter(t => t.id !== id);
		this.api.deleteTodo(id).then(() => {
			this.renderItems();
		});
	}
}


export default TodoApp;
