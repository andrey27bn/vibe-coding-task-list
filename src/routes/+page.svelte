<script lang="ts">
  import AddTaskForm from '$lib/components/forms/AddTaskForm.svelte';
  import TaskCard from '$lib/components/TaskCard.svelte';
  import SearchInput from '$lib/components/ui/SearchInput.svelte';
  import taskStore, { type TaskSortMode } from '$lib/db/TaskStore'; 

  // Реактивная подписка на store с помощью префикса $
  $: tasks = $taskStore;
  
  // Используем let для объявления реактивного состояния (теперь currentSort – это let)
  let currentSort: TaskSortMode = 'createdAt'; 

  function handleSearch(event: CustomEvent<string>) {
    taskStore.search(event.detail);
  }

  function handleSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    currentSort = select.value as TaskSortMode;
    // Вызываем сортировку после обновления значения
    taskStore.sortTasks(currentSort);
  }

  // При первой загрузке или изменении currentSort (если бы мы использовали bind), 
  // вызываем сортировку для отображения начального порядка.
  // Так как мы используем on:change, просто убедимся, что store загружен правильно.
</script>

<svelte:head>
  <title>Vibe Task List (SvelteKit & Dexie)</title>
</svelte:head>

<main class="container mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
  <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center">
    📝 Менеджер задач (SvelteKit)
  </h1>

  <div class="lg:grid lg:grid-cols-3 lg:gap-8">
    
    <div class="lg:col-span-1 mb-8 lg:mb-0">
      <AddTaskForm />
    </div>

    <div class="lg:col-span-2">
      <SearchInput on:search={handleSearch} />
      
      <div class="flex justify-end items-center mb-4">
          <label for="sort-select" class="text-sm font-medium text-gray-700 mr-2">Сортировать по:</label>
          <select 
              id="sort-select" 
              value={currentSort}
              on:change={handleSortChange}
              class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 form-select py-1"
          >
              <option value="createdAt">Дате создания</option>
              <option value="status">Статусу (Активные первыми)</option>
          </select>
      </div>
      <div class="mt-6 space-y-4">
        {#if tasks.length === 0}
          <div class="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p class="text-lg font-medium mb-2">Список задач пуст.</p>
            {#if $taskStore.length !== 0}
               <p class="text-sm">Нет задач, соответствующих вашему запросу.</p>
            {:else}
               <p class="text-sm">Начните с добавления новой задачи слева.</p>
            {/if}
          </div>
        {:else}
          {#each tasks as task (task.id)}
            <TaskCard {task} />
          {/each}
        {/if}
      </div>
    </div>
  </div>
</main>