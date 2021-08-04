<template>
  <v-text-field
    type="text"
    label="ユーザー名"
    filled
    placeholder="割勘 太郎"
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
