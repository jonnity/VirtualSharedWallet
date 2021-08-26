<template>
  <v-text-field
    type="text"
    label="セッション名"
    filled
    placeholder="夏旅行20XX"
    height="40px"
    hide-details
    :value="value"
    @input="$emit('input', $event)"
  ></v-text-field>
</template>

<script>
export default {
  name: "userTextField",
  props: ["value"],
};
</script>
