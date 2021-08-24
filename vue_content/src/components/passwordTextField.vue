<template>
  <v-text-field
    v-model="value"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    :rules="[rules.required, rules.min8]"
    :type="show ? 'text' : 'password'"
    label="パスワード"
    @click:append="show = !show"
    :disabled="!enablePassword"
    :value="value"
    @input="$emit('input', $event)"
  >
  </v-text-field>
</template>

<script>
export default {
  name: "passwordTextField",
  props: ["value", "enablePassword"],
  data() {
    return {
      show: false,
      rules: {
        required: (value) => !!value || "パスワードを入力してください",
        min8: (v) => v.length >= 8 || "8文字以上の文字列を入力してください",
      },
    };
  },
};
</script>

<style>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
