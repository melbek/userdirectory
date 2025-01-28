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
  const countryCount = store.users.reduce((acc, user) => {
    const country = user.location.country;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedData = Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Show top 10 countries

  return {
    labels: sortedData.map(([country]) => country),
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
  plugins: {
    legend: {
      display: false
    }
  }
};
</script>