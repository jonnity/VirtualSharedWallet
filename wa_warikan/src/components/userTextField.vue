<template>
    <v-text-field
        type="text"
        label="ユーザー名"
        filled
        placeholder="割勘 太郎"
        height="40px"
        hide-details
        :value="modelValue"
        @input="$emit('update:model', $event.target.value)"
    ></v-text-field>
</template>

<script>
export default {
    name: "userTextFiled",
    props: ['modelValue'],

}
</script>
