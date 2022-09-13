<template>
  <div class="modal">
    <div class="modal__wrapper">
      <button class="modal__close" @click="toggleModal(-1)">
        <img src="@/assets/img/redo.svg" alt="">
      </button>
      <div class="modal__main">
        <slot></slot>
      </div>
    </div>
  </div>
  <div class="modal__background" @click="toggleModal(-1)"></div>
</template>

<script>
export default {
  name: "ModalRight",
  emits: ['toggleModal'],
  setup(props, {emit}) {

    function toggleModal(state) {
      emit('toggleModal', state);
    }

    return { toggleModal }

  }
}
</script>

<style scoped>

.modal {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2000;

  height: 100vh;

  box-shadow: 0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14);

  background-color: #fff;
}

.modal__wrapper {
  position: relative;
  z-index: 2;
}

.modal__close {
  position: absolute;
  top: 70px;
  left: -48px;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 48px;
  height: 48px;

  border-radius: 12px 0 0 12px;
  box-shadow: inset -15px 0 13px -16px hsl(0deg 0% 45% / 20%);

  background-color: #FAFAFA;
}

.modal__main {
  height: 100vh;
  padding: 50px 30px;

  overflow-y: scroll;
}

.modal__main::-webkit-scrollbar {
  display: none;
}

.modal__background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1500;

  width: 100vw;
  height: 100vh;
  cursor: pointer;

  background: rgba(0, 0, 0, 0.3);
}
</style>