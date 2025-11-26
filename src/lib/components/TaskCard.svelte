<script lang="ts">
  import type { Task } from '$lib/db/types';
  import taskStore from '$lib/db/TaskStore';
  import { fade } from 'svelte/transition';
  import EditTaskModal from '$lib/components/forms/EditTaskModal.svelte'; 

  export let task: Task;

  $: isCompleted = task.status === 'completed';
  let isEditing = false; // Состояние модального окна

  function handleToggle() {
    if (task.id !== undefined) {
      taskStore.toggleTaskStatus(task.id);
    }
  }

  function handleDelete() {
    if (task.id !== undefined) {
      taskStore.removeTask(task.id);
    }
  }

  function handleSaveEdit(event: CustomEvent<{ title: string; description: string }>) {
    if (task.id !== undefined) {
      // Вызываем метод обновления Store
      taskStore.updateExistingTask(task.id, event.detail);
      isEditing = false; // Закрываем модальное окно после сохранения
    }
  }
</script>

<div 
  in:fade={{ duration: 200 }} 
  out:fade={{ duration: 200 }}
  class="{isCompleted ? 'bg-gray-50 border-gray-300' : 'bg-white border-indigo-400'} 
         p-5 border-l-4 shadow-md rounded-lg flex justify-between items-start transition duration-300"
>
  <div class="flex-grow pr-4">
    <h3 class="{isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'} 
               text-lg font-bold mb-1 break-words">
      {task.title}
    </h3>
    {#if task.description}
      <p class="{isCompleted ? 'text-gray-400' : 'text-gray-600'} 
                text-sm break-words">
        {task.description}
      </p>
    {/if}
    
    <span class="{isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} 
                 mt-2 inline-block px-2 py-0.5 text-xs font-semibold rounded-full">
      {isCompleted ? 'Завершено' : 'Активно'}
    </span>
  </div>

  <div class="flex space-x-2 flex-shrink-0">
    <button
      on:click={() => isEditing = true}
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition"
      aria-label="Редактировать задачу"
    >
      Редактировать
    </button>

    <button
      on:click={handleToggle}
      class="{isCompleted ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}
             text-white font-semibold py-1 px-3 rounded-md text-sm transition"
      aria-label={isCompleted ? 'Возобновить задачу' : 'Завершить задачу'}
    >
      {isCompleted ? 'Возобновить' : 'Завершить'}
    </button>
    
    <button
      on:click={handleDelete}
      class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition"
      aria-label="Удалить задачу"
    >
      Удалить
    </button>
  </div>
</div>

{#if isEditing}
  <EditTaskModal 
    {task} 
    on:close={() => isEditing = false} 
    on:save={handleSaveEdit}
  />
{/if}