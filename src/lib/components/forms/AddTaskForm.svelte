<script lang="ts">
  import taskStore from '$lib/db/TaskStore';
  import type { NewTaskData } from '$lib/db/db';

  let title: string = '';
  let description: string = '';
  let error: string = '';
  let isSubmitting: boolean = false;

  async function handleSubmit() {
    error = '';
    
    // 1. Клиентская валидация
    if (!title.trim()) {
      error = 'Название задачи (Title) не может быть пустым.';
      return;
    }

    isSubmitting = true;
    try {
      const data: NewTaskData = {
        title: title.trim(),
        description: description.trim(),
      };
      
      // 2. Вызов Store
      await taskStore.addNewTask(data);
      
      // 3. Сброс формы после успеха
      title = '';
      description = '';
    } catch (e) {
      // Это сработает, если будет ошибка записи в IndexDB, хотя маловероятно
      error = 'Произошла ошибка при сохранении задачи.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="p-6 bg-white shadow-xl rounded-2xl">
  <h2 class="text-2xl font-semibold text-gray-800 mb-6">➕ Добавить новую задачу</h2>
  
  <form on:submit|preventDefault={handleSubmit}>
    {#if error}
      <div class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        {error}
      </div>
    {/if}

    <div class="mb-4">
      <label for="title" class="block text-sm font-medium text-gray-700">Название (Title) *</label>
      <input
        type="text"
        id="title"
        bind:value={title}
        required
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div class="mb-6">
      <label for="description" class="block text-sm font-medium text-gray-700">Описание (Description)</label>
      <textarea
        id="description"
        bind:value={description}
        rows="3"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      class="w-full py-2 px-4 border border-transparent rounded-lg shadow-md text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition duration-150"
    >
      {isSubmitting ? 'Сохранение...' : 'Создать задачу'}
    </button>
  </form>
</div>