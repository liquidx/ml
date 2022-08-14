<template>
  <div class="flex flex-row h-full">
    <div
      class="p-4 w-96 text-sm overflow-y-scroll overflow-x-hidden max-h-screen"
    >
      <ImageList
        :images="images.screenshots"
        :labels="images.labels"
        :selectedIndex="images.selectedImageIndex"
        @file-did-click="fileDidSelect"
      />
    </div>
    <div class="border-1 border-red-100 flex-grow">
      <ImageViewer :filename="images.selectedImage" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import useHotkey from "vue3-hotkey";
import { orderBy } from "lodash-es";

import ImageList from "./ImageList.vue";
import ImageViewer from "./ImageViewer.vue";

const hotkeys = ref([
  {
    keys: ["i"],
    preventDefault: true,
    handler: () => {
      console.log("include");
      includeSelectedImage();
    },
  },
  {
    keys: ["x"],
    preventDefault: true,
    handler: () => {
      console.log("exclude");
      excludeSelectedImage();
    },
  },

  {
    keys: ["n"],
    preventDefault: true,
    handler: () => {
      nextImage();
    },
  },
  {
    keys: ["p"],
    preventDefault: true,
    handler: () => {
      prevImage();
    },
  },
]);

const hotKeyImpl = useHotkey(hotkeys.value);

const images = reactive({
  screenshots: [],
  selectedImage: "",
  selectedImageIndex: -1,
  constSelectedImageIndex: 0,
  labels: [],
  pageSize: 50,
  page: 0,
});

const nextImage = () => {
  if (images.selectedImageIndex < images.screenshots.length - 1) {
    images.selectedImageIndex += 1;
  }
  images.selectedImage = images.screenshots[images.selectedImageIndex];
};

const prevImage = () => {
  if (images.selectedImageIndex > 0) {
    images.selectedImageIndex -= 1;
  }
  images.selectedImage = images.screenshots[images.selectedImageIndex];
};

const fileDidSelect = (filename) => {
  const index = images.screenshots.indexOf(filename);
  console.log(filename, index);
  if (index) {
    images.selectedImage = filename;
    images.selectedImageIndex = index;
  }
};

const loadImages = () => {
  getImageList().then((screenshots) => {
    images.screenshots = orderBy(screenshots).slice(0, 1000);
  });
  getLabels().then((labels) => {
    images.labels = labels;
  });
};

const getImageList = () => {
  return axios.get("http://localhost:12000/images").then((response) => {
    return response.data.screenshots;
  });
};

const getLabels = () => {
  return axios.get("http://localhost:12000/labels").then((response) => {
    return response.data;
  });
};

const deleteImage = (filename) => {
  const params = new URLSearchParams({ imageId: filename });
  return axios.delete("http://localhost:12000/images?" + params.toString());
};

const includeSelectedImage = async () => {
  const filename = images.selectedImage;
  const params = new URLSearchParams({ imageId: filename, label: "include" });
  axios
    .post("http://localhost:12000/labels?" + params.toString())
    .then((response) => {
      images.labels = response.data;
    });
  nextImage();
};

const excludeSelectedImage = async () => {
  const filename = images.selectedImage;
  const params = new URLSearchParams({ imageId: filename, label: "exclude" });
  axios
    .post("http://localhost:12000/labels?" + params.toString())
    .then((response) => {
      images.labels = response.data;
    });
  nextImage();
};

onMounted(() => {
  loadImages();
});
</script>
