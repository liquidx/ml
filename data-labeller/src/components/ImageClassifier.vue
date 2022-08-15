<template>
  <div class="flex flex-row h-screen container">
    <div
      class="m-4 p-4 border border-red-200 w-96 text-sm overflow-y-scroll overflow-x-hidden relative"
    >
      <h1 class="my-4 font-bold">WebLabeler</h1>

      <div class="flex flex-row my-4 gap-2">
        <a href="#" @click.prevent="showPrevPage">&lt; Prev </a>
        <a href="#" @click.prevent="showNextPage">Next &gt;</a>
      </div>
      <ImageList
        :images="images.displayedScreenshots"
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
    keys: ["g"],
    preventDefault: true,
    handler: () => {
      toggleLabel("good");
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
  labels: {},
  displayedScreenshots: [],
  pageSize: 500,
  page: 0,
});

const nextImage = () => {
  if (images.selectedImageIndex < images.displayedScreenshots.length - 1) {
    images.selectedImageIndex += 1;
  }
  images.selectedImage = images.displayedScreenshots[images.selectedImageIndex];
};

const prevImage = () => {
  if (images.selectedImageIndex > 0) {
    images.selectedImageIndex -= 1;
  }
  images.selectedImage = images.displayedScreenshots[images.selectedImageIndex];
};

const fileDidSelect = (filename) => {
  const index = images.displayedScreenshots.indexOf(filename);
  console.log(filename, index);
  if (index > -1) {
    images.selectedImage = filename;
    images.selectedImageIndex = index;
  }
};

const loadImages = () => {
  getImageList().then((screenshots) => {
    images.screenshots = orderBy(screenshots);
    images.displayedScreenshots = images.screenshots.slice(0, images.pageSize);
  });
  getLabels().then((labels) => {
    images.labels = labels.fileLabels;
    console.log(images.labels);
  });
};

const showPrevPage = () => {
  images.page -= 1;
  images.displayedScreenshots = images.screenshots.slice(
    images.page * images.pageSize,
    (images.page + 1) * images.pageSize
  );
  images.selectedImageIndex = -1;
  images.selectedImage = "";
};

const showNextPage = () => {
  images.page += 1;
  images.displayedScreenshots = images.screenshots.slice(
    images.page * images.pageSize,
    (images.page + 1) * images.pageSize
  );
  images.selectedImageIndex = -1;
  images.selectedImage = "";
};

const showPage = (n) => {
  images.page = n;
  images.displayedScreenshots = images.screenshots.slice(
    n * images.pageSize,
    (n + 1) * images.pageSize
  );
  images.selectedImageIndex = -1;
  images.selectedImage = "";
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
      images.labels = response.data.fileLabels;
    });
  nextImage();
};

const excludeSelectedImage = async () => {
  const filename = images.selectedImage;
  const params = new URLSearchParams({ imageId: filename, label: "exclude" });
  axios
    .post("http://localhost:12000/labels?" + params.toString())
    .then((response) => {
      images.labels = response.data.fileLabels;
    });
  nextImage();
};

const toggleLabel = (label) => {
  const filename = images.selectedImage;
  const params = new URLSearchParams({
    imageId: filename,
    label: label,
    toggle: true,
  });
  axios
    .post("http://localhost:12000/labels?" + params.toString())
    .then((response) => {
      images.labels = response.data.fileLabels;
    });
  nextImage();
};

onMounted(() => {
  loadImages();
});
</script>
