<template>
  <div class="modal-submit">
    <p class="submit__title">
      <slot name="title"></slot>
    </p>
    <div class="submit__wrapper">
      <button class="submit__cancel link--main" @click="$emit('modalCancel')">
        <slot name="cancel"></slot>
      </button>
      <button class="modal__submit link--second" @click="$emit('modalSubmit')">
        <slot name="submit"></slot>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalSubmit"
}
</script>

<style scoped>
.modal-submit {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 5;

  padding: 15px 30px;
  border-radius: 10px;

  box-shadow: 0 0 8px 2px rgba(34, 60, 80, 0.2);
  transform: translateY(-50%) translateX(-50%);

  background-color: #fff;
}

.submit__title {
  font-size: 16px;
}

.submit__wrapper {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.submit__cancel {
  margin-right: 15px;
}
</style>