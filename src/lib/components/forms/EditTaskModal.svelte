<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Task } from '$lib/db/types';

  export let task: Task;

  const dispatch = createEventDispatcher<{ close: void; save: { title: string; description: string } }>();

  let title: string = task.title;
  let description: string = task.description || '';
  let error: string = '';
  let isSaving: boolean = false;

  function handleSave() {
    error = '';
    if (!title.trim()) {
      error = 'Название задачи не может быть пустым.';
      return;
    }
    
    isSaving = true;
    
    dispatch('save', {
      title: title.trim(),
      description: description.trim(),
    });

    // Модальное окно будет закрыто родительским компонентом после обновления store
  }
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg transition-all transform scale-100" role="dialog" aria-modal="true">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">✍️ Редактировать задачу</h2>
      <button on:click={() => dispatch('close')} class="text-gray-400 hover:text-gray-600 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <form on:submit|preventDefault={handleSave}>
      {#if error}
        <div class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>
      {/if}

      <div class="mb-4">
        <label for="edit-title" class="block text-sm font-medium text-gray-700">Название (Title) *</label>
        <input
          type="text"
          id="edit-title"
          bind:value={title}
          required
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div class="mb-6">
        <label for="edit-description" class="block text-sm font-medium text-gray-700">Описание (Description)</label>
        <textarea
          id="edit-description"
          bind:value={description}
          rows="3"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>
      
      <div class="mb-6">
          <label for="status" class="block text-sm font-medium text-gray-700">Статус</label>
          <input 
              type="text" 
              value={task.status === 'active' ? 'Активна' : 'Завершена'} 
              disabled 
              class="block w-full rounded-md border-gray-200 bg-gray-100 text-gray-500 shadow-sm"
          >
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          on:click={() => dispatch('close')}
          class="py-2 px-4 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-100 transition"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isSaving}
          class="py-2 px-4 border border-transparent rounded-lg shadow-md text-white font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition"
        >
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  </div>
</div>