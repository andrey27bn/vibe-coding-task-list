import { writable, type Writable } from 'svelte/store';
import { db } from './db';
import type { Task, NewTaskData } from './types';

export type TaskStore = Writable<Task[]> & {
	loadTasks: () => Promise<void>;
	addNewTask: (data: NewTaskData) => Promise<void>;
	removeTask: (id: number) => Promise<void>;
	toggleTaskStatus: (id: number) => Promise<void>;
	updateExistingTask: (id: number, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
	search: (query: string) => Promise<void>;
	sortTasks: (mode: TaskSortMode) => Promise<void>;
};

// Тип для сортировки
export type TaskSortMode = 'createdAt' | 'status';

const { subscribe, set, update } = writable<Task[]>([]);

const taskStore: TaskStore = {
	subscribe,

	// R - Загрузка данных
	async loadTasks(): Promise<void> {
		try {
			const tasks = await db.getAllTasks();
			set(tasks);
		} catch (error) {
			console.error('Ошибка загрузки задач:', error);
			set([]);
		}
	},

	// C - Добавление новой задачи
	async addNewTask(data: NewTaskData): Promise<void> {
		try {
			const id = await db.addTask(data);
			const newTask = {
				...data,
				id,
				status: 'active' as const,
				createdAt: new Date()
			};
			// Добавляем новую задачу в начало Store
			update((tasks) => [newTask, ...tasks]);
		} catch (error) {
			console.error('Ошибка добавления задачи:', error);
		}
	},

	// D - Удаление задачи
	async removeTask(id: number): Promise<void> {
		try {
			await db.deleteTask(id);
			// Фильтруем Store
			update((tasks) => tasks.filter((t) => t.id !== id));
		} catch (error) {
			console.error('Ошибка удаления задачи:', error);
		}
	},

	// U - Переключение статуса
	async toggleTaskStatus(id: number): Promise<void> {
		update((tasks) => {
			const task = tasks.find((t) => t.id === id);
			if (task) {
				const newStatus = task.status === 'active' ? 'completed' : 'active';
				db.updateTaskStatus(id, newStatus);
				task.status = newStatus;
			}
			return tasks;
		});
	},

	// U - Обновление задачи (НОВЫЙ МЕТОД)
	async updateExistingTask(
		id: number,
		data: Partial<Omit<Task, 'id' | 'createdAt'>>
	): Promise<void> {
		try {
			await db.updateTask(id, data);

			update((tasks) => {
				const index = tasks.findIndex((t) => t.id === id);
				if (index !== -1) {
					// Обновляем данные в Store, сохраняя существующие поля
					tasks[index] = { ...tasks[index], ...data };
				}
				return tasks;
			});
		} catch (error) {
			console.error('Ошибка обновления задачи:', error);
		}
	},

	// Поиск (фильтрация)
	async search(query: string): Promise<void> {
		try {
			const results = await db.searchTasks(query);
			set(results);
		} catch (error) {
			console.error('Ошибка поиска задач:', error);
		}
	},

	// Сортировка (НОВЫЙ МЕТОД)
	async sortTasks(mode: TaskSortMode): Promise<void> {
		// В отличие от поиска, здесь мы снова берем все задачи, чтобы обеспечить корректную сортировку
		// (Поиск уже делает это, но явный вызов здесь гарантирует, что мы сортируем полный список)
		const allTasks = await db.getAllTasks();

		let sortedTasks: Task[];

		if (mode === 'status') {
			// Сортируем: Активные ('active') идут первыми, затем Завершенные ('completed').
			// Внутри статуса сохраняем сортировку по дате создания (новые сверху).
			sortedTasks = allTasks.sort((a, b) => {
				if (a.status === 'active' && b.status === 'completed') return -1;
				if (a.status === 'completed' && b.status === 'active') return 1;

				// Если статус одинаковый (оба active или оба completed),
				// сортируем по дате создания (новые сверху)
				return b.createdAt.getTime() - a.createdAt.getTime();
			});
		} else {
			// Сортировка по дате создания (новые сверху, как в getAllTasks())
			sortedTasks = allTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
		}

		set(sortedTasks);
	}
};

// Инициализируем загрузку данных при старте
taskStore.loadTasks();

export default taskStore;
