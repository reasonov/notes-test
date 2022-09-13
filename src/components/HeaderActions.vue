<template>
  <div class="select__wrapper">
    <custom-checkbox :isActive="noteList.length === selectNumber" @click="toggleAll" />
    <p class="select__text">Выбрано: {{ selectNumber }}</p>
  </div>
  <button class="select__wrapper" @click="deleteModalToggle">
    <img class="delete-icon" src="@/assets/img/close-icon.svg" alt="">
    <p class="select__text">Удалить</p>
  </button>

  <modal-submit @modalCancel="deleteModalState = false" @modalSubmit="deleteNote" v-if="deleteModalState">
    <template v-slot:title>Удалить заметку?</template>
    <template v-slot:cancel>Отменить</template>
    <template v-slot:submit>Удалить</template>
  </modal-submit>

</template>

<script>
import CustomCheckbox from "@/components/CustomCheckbox.vue";
import ModalSubmit from "@/components/ModalSubmit";
import {computed, ref} from "vue";
import { useStore } from "vuex";

export default {
  name: "HeaderActions",
  components: {
    CustomCheckbox,
    ModalSubmit
  },
  setup() {
    const store = useStore();

    const noteList = computed(() => {
      return store.state.noteList;
    })

    // number of selected notes
    const selectNumber = computed(() => {
      let number = 0;
      noteList.value.forEach((item) => {
        if(item.selected) number++
      })
      return number;
    })

    function noteToggle(id, state) {
      store.commit('noteToggle', {
        id: id,
        state: state
      })
    }

    // select or disable all notes
    function toggleAll() {
      if (selectNumber.value >= noteList.value.length) {
        noteList.value.forEach((item) => {
          noteToggle(item.id, false)
        })
      } else {
        noteList.value.forEach((item) => {
          noteToggle(item.id, true)
        })
      }
    }

    // state of the modal for deleting a note
    const deleteModalState = ref(false);

    function deleteModalToggle() {
      if(selectNumber.value > 0) {
        deleteModalState.value = true;
      }
    }

    function deleteNote() {
      let idList = [];
      noteList.value.forEach((item) => {
        if(item.selected) idList.push(item.id);
      })
      store.commit('deleteNote', {
        id: idList
      })
      deleteModalState.value = false;
    }

    return { noteList, selectNumber, toggleAll, deleteModalToggle, deleteNote, deleteModalState }
  }
}
</script>

<style scoped>
.select__wrapper {
  display: flex;
  align-items: center;

  margin-bottom: 10px;
  margin-right: 35px;
}

.select__text {
  margin-left: 7px;

  font-size: 16px;
  line-height: 20px;
}

.delete-submit {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 5;

  padding: 15px 30px;
  border-radius: 10px;

  box-shadow: 0px 0px 8px 2px rgba(34, 60, 80, 0.2);
  transform: translateY(-50%) translateX(-50%);
}

.delete__wrapper {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.delete__cancel {
  margin-right: 15px;
}
</style>