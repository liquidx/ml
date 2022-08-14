<template>
  <div class="">
    <div
      v-for="(filename, index) in props.images"
      :key="filename"
      :class="classesForImage(filename, index)"
    >
      <button
        class="cursor-pointer hover:underline"
        :data-filename="filename"
        @click.prevent="fileDidClick"
      >
        {{ filename }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({
  images: {
    type: Array,
    default: [],
  },
  selectedIndex: {
    type: Number,
    default: 0,
  },
  labels: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["fileDidClick"]);

const classesForImage = (filename, index) => {
  const klasses = [];
  if (index == props.selectedIndex) {
    klasses.push("font-bold");
  }
  const labels = props.labels.filter((label) => label[0] == filename);
  if (labels.length > 0) {
    let lastLabel = labels[labels.length - 1];
    if (lastLabel[1] == "exclude") {
      klasses.push("text-red-500");
    } else {
      klasses.push("text-green-500");
    }
  }
  return klasses.join(" ");
};

const fileDidClick = (e) => {
  const filename = e.target.getAttribute("data-filename");
  emit("fileDidClick", filename);
};
</script>
