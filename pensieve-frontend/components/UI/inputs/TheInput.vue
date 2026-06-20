<template>
    <div class="main-input__wrap">
        <div class="main-input__wrap-placeholder">{{ placeholder }}</div>
        <input :type="props.type" :name="props.name" :id="props.id" :value="props.modelValue" @input="onInputEvent"
            @blur="onBlurEvent" @focus="onFocusEvent" />
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: String,
    placeholder: String,
    type: {
        type: String,
        default: 'text',
    },
    name: String,
    id: String,
});

const onInputEvent = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};

const onBlurEvent = () => {
};

const onFocusEvent = () => {
};
</script>


<style lang="scss" scoped>
.main-input__wrap {
    input {
        padding: 8px 20px;
        height: auto;
        width: 100%;
        background-color: #FFFFFF;
        border-radius: 15px;
        border: 0;
        font-family: 'Montserrat';
        text-transform: initial;
        font-size: rems(20px);
    }
}

.main-input__wrap-placeholder {
    margin-bottom: 15px;
    font-size: rems(20px);
    line-height: 1em;
}
</style>