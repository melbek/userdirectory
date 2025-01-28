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
  const ageRanges: Record<string, number> = {};
  
  store.users.forEach(user => {
    const rangeStart = Math.floor(user.age / 5) * 5;
    const range = `${rangeStart}-${rangeStart + 4}`;
    ageRanges[range] = (ageRanges[range] || 0) + 1;
  });

  const sortedRanges = Object.entries(ageRanges)
    .sort((a, b) => {
      const aStart = parseInt(a[0].split('-')[0]);
      const bStart = parseInt(b[0].split('-')[0]);
      return aStart - bStart;
    });

  return {
    labels: sortedRanges.map(([range]) => range),
    datasets: [{
      label: 'Number of Users',
      data: sortedRanges.map(([, count]) => count),
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