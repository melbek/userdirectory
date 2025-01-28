<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">User Statistics</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4">Users by Country</h2>
        <ChartsUsersByCountry />
      </div>
      
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4">Gender Distribution</h2>
        <ChartsGenderDistribution />
      </div>
      
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4">Age Distribution</h2>
        <ChartsAgeDistribution />
      </div>
      
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4">Users by Tag</h2>
        <ChartsUsersByTag />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>