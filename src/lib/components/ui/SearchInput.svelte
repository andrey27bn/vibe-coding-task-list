<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { debounce } from '$lib/utils/debounce'; // Будет создан в 2.3.1

  const dispatch = createEventDispatcher<{ search: string }>();

  let searchQuery: string = '';

  // Эффект Svelte для слежения за query и применения debounce
  $: debouncedSearch(searchQuery);

  // Используем утилиту debounce
  const debouncedSearch = debounce((query: string) => {
    dispatch('search', query);
  }, 300);
</script>

<div class="relative mb-6">
  <input
    type="text"
    placeholder="🔍 Поиск по названию задачи..."
    bind:value={searchQuery}
    class="block w-full py-3 px-4 pl-10 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
  />
</div>