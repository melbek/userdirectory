<template>
  <div class="h-[300px]">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useUserStore } from '@/store/users';

ChartJS.register(ArcElement, Tooltip, Legend);

const store = useUserStore();

const chartData = computed(() => {
  const genderCount = store.users.reduce((acc, user) => {
    acc[user.gender] = (acc[user.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(genderCount).map(gender => 
      gender.charAt(0).toUpperCase() + gender.slice(1)
    ),
    datasets: [{
      data: Object.values(genderCount),
      backgroundColor: ['#4F46E5', '#EC4899'],
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>