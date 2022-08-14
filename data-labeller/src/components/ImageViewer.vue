<template>
  <div class="p-4 flex flex-row">
    <div class="px-4 w-64">
      <div class="my-4 font-bold">Actions</div>
      <div>
        <button class=""><span class="underline">I</span>nclude</button>
      </div>
      <div>
        <button class="">E<span class="underline">x</span>clude</button>
      </div>
      <div>
        <button class=""><span class="underline">N</span>ext</button>
      </div>
      <div>
        <button class=""><span class="underline">P</span>rev</button>
      </div>
    </div>
    <div>
      <img :src="'/rico-screenshots/' + filename" class="w-96" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  filename: {
    type: String,
    default: "",
  },
});
</script>
