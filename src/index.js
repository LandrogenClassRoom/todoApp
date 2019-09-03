import Handlebars from 'handlebars';
import uuid from 'uuid';
import API from './api';
import TodoApp from './app';

new TodoApp(API);

(function () {
	const addTodoForm = document.getElementById('todo-form');
	const todoListContainer = document.getElementById('todo-list');

	const todoItemTpl = document.getElementById('todo-items').innerHTML;
	const todoItemsTemplate = Handlebars.compile(todoItemTpl);

	/**
	 * Рендер списка задач
	 */
	const renderTodoList = () => {
		todoListContainer.innerHTML = todoItemsTemplate({items: todoItems});
	};

	let todoItems = [];

	/**
	 * Измененеи статуса задачи
	 * @param id
	 */
	function changeStatus(id) {
		let updatedTodo = null;
		todoItems = todoItems.map(t => {
			if (t.id === id) {
				t.done = !t.done;
				updatedTodo = t;
			}
			return t;
		});

		if (updatedTodo) {
			API.updateTodo(updatedTodo).then(() => {
				renderTodoList();
			});
		}
	}

	/**
	 * Удаление задачи
	 * @param id
	 */
	function deleteTodo(id) {
		todoItems = todoItems.filter(t => t.id !== id);
		API.deleteTodo(id).then(() => {
			renderTodoList();
		});
	}

	/**
	 * Инициализация
	 */
	function initApp() {
		API.getAllTodo().then(items => {
			todoItems = items;
			renderTodoList();
		});

		todoListContainer.addEventListener('click', e => {
			if (e.target && e.target.dataset.action) {
				e.preventDefault();
				const {action, id} = e.target.dataset;
				switch (action) {
				case 'delete':
					deleteTodo(id);
					break;
				case 'complete':
					changeStatus(id);
					break;
				default:
					break;
				}
			}
		});

		addTodoForm.addEventListener('submit', e => {
			e.preventDefault();

			const newTodo = {
				id: uuid(),
				dateTime: new Date().getTime(),
				text: addTodoForm.text.value,
				done: false,
			};

			API.addTodo(newTodo).then((newTodo) => {
				todoItems = [...todoItems, newTodo];
				renderTodoList();
			});

			addTodoForm.reset();
		});
	}

	initApp();
});




