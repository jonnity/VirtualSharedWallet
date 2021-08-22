<template>
  <v-icon @click="copyToClipboard(text)">mdi-content-copy</v-icon>
</template>

<script>
export default {
  name: "textCopyButton",
  components: {},
  data() {
    return {};
  },
  props: ["text"],
  methods: {
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("copied!");
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>

<style></style>
