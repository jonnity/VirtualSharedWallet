<template>
  <v-text-field
    type="number"
    prefix="￥"
    label="金額"
    dence
    solo
    hide-details
    :value="value"
    @input="$emit('input', $event)"
  ></v-text-field>
</template>

<script>
export default {
    name: "moneyTextField",
    props: ['value'],
}
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
