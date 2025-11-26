// Определяем возможные статусы задачи
export type TaskStatus = 'active' | 'completed';

// Основной интерфейс задачи
export interface Task {
	id?: number; // ID опционален, т.к. генерируется базой данных
	title: string;
	description?: string; // Описание опционально
	status: TaskStatus;
	createdAt: Date; // Дата создания для сортировки
}

// Тип для создания новой задачи (без id и createdAt)
export type NewTaskData = Omit<Task, 'id' | 'createdAt' | 'status'>;
