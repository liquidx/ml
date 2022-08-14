<template>
  <div class="bg-gray-200 h-screen w-screen">
    <div class="p-4 color-gray-700 text-3xl font-bold">Data Labeller</div>
    <ImageClassifier />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ImageClassifier from "./components/ImageClassifier.vue";
</script>
