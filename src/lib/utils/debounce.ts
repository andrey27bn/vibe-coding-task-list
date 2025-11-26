/**
 * Задерживает выполнение функции до тех пор, пока не перестанут поступать вызовы в течение указанного времени.
 * @param func Функция для выполнения.
 * @param delay Задержка в миллисекундах.
 */
export function debounce<T extends any[]>(func: (...args: T) => void, delay: number) {
	let timeoutId: NodeJS.Timeout | null = null;

	return function (this: any, ...args: T) {
		// Очищаем предыдущий таймаут, если он был
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// Устанавливаем новый таймаут
		timeoutId = setTimeout(() => {
			func.apply(this, args);
			timeoutId = null;
		}, delay);
	};
}
