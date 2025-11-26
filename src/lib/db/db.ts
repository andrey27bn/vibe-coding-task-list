import Dexie, { type Table } from 'dexie';
import type { Task, NewTaskData } from './types';

export class TaskDB extends Dexie {
	tasks!: Table<Task>;

	constructor() {
		super('VibeTaskDB');
		// Version 1: Определение схемы
		this.version(1).stores({
			// id - автоинкрементный индекс, title - индекс для поиска
			tasks: '++id, title, status, createdAt'
		});
		this.tasks = this.table('tasks');
	}

	// C - Создание
	async addTask(data: NewTaskData): Promise<number> {
		const newTask: Omit<Task, 'id'> = {
			...data,
			status: 'active',
			createdAt: new Date()
		};
		return await this.tasks.add(newTask as Task);
	}

	// R - Чтение
	async getAllTasks(): Promise<Task[]> {
		// Получаем все задачи, сортируем по дате создания в обратном порядке (новые сверху)
		return await this.tasks.orderBy('createdAt').reverse().toArray();
	}

	// D - Удаление
	async deleteTask(id: number): Promise<void> {
		return await this.tasks.delete(id);
	}

	// U - Обновление полной задачи
	async updateTask(id: number, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<number> {
		// Dexie автоматически игнорирует обновление автоинкрементных ключей
		return await this.tasks.update(id, updates);
	}

	// U - Обновление статуса
	async updateTaskStatus(id: number, status: Task['status']): Promise<number> {
		return await this.tasks.update(id, { status });
	}

	// Поиск
	async searchTasks(query: string): Promise<Task[]> {
		if (!query) return this.getAllTasks();

		// Ищем задачи, где title начинается с query (case-insensitive)
		const results = await this.tasks
			.where('title')
			.startsWithIgnoreCase(query)
			.reverse() // Применяем сортировку после фильтра
			.toArray();

		return results;
	}
}

export const db = new TaskDB();
