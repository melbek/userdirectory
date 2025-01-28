<template>
  <div class="h-[300px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useUserStore } from '@/store/users';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const store = useUserStore();

const chartData = computed(() => {
  const tagCount: Record<string, number> = {};
  
  store.users.forEach(user => {
    user.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const sortedData = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Show top 10 tags

  return {
    labels: sortedData.map(([tag]) => tag),
    datasets: [{
      label: 'Number of Users',
      data: sortedData.map(([, count]) => count),
      backgroundColor: '#4F46E5',
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      display: false
    }
  }
};
</script>