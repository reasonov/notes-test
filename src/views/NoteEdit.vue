<template>
  <div class="modal__wrapper">
    <div class="modal__header">
      <h3 class="title">Редактирование заметки</h3>
      <div class="header__actions">
        <button
            class="action"
            :class="{'action--active': updatedNoteData.fix}"
            @click="updatedNoteData.fix = !updatedNoteData.fix"
        >
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.56487 0.624675C5.79991 0.389283 6.08695 0.212229 6.40294 0.107738C6.71892 0.00324567 7.05504 -0.0257713 7.38429 0.0230173C7.71354 0.0718059 8.02674 0.19704 8.29874 0.38866C8.57073 0.580279 8.79394 0.832942 8.95043 1.12635L11.8167 6.4974L15.8053 7.82528C15.9201 7.86337 16.0232 7.93016 16.1049 8.01929C16.1866 8.10842 16.2441 8.21693 16.272 8.33452C16.2999 8.4521 16.2972 8.57485 16.2642 8.6911C16.2311 8.80735 16.1689 8.91324 16.0834 8.9987L13.0369 12.0399L16.7928 15.7912L17 17L15.7882 16.7931L12.0338 13.0419L8.98874 16.0845C8.90317 16.1699 8.79716 16.2321 8.68076 16.2651C8.56437 16.298 8.44147 16.3007 8.32373 16.2729C8.206 16.2451 8.09735 16.1876 8.00811 16.106C7.91887 16.0245 7.85201 15.9214 7.81387 15.8067L6.48433 11.8245L1.12221 8.95618C0.829948 8.79959 0.578375 8.57694 0.387556 8.30601C0.196737 8.03508 0.0719547 7.72336 0.023159 7.39572C-0.0256348 7.06807 0.00291061 6.73357 0.10652 6.4189C0.210129 6.10423 0.385933 5.8181 0.619907 5.58333L5.56345 0.623258L5.56487 0.624675ZM7.69893 1.79242C7.64681 1.69445 7.57237 1.61007 7.48163 1.54608C7.39088 1.48209 7.28636 1.44028 7.17647 1.42401C7.06659 1.40774 6.95441 1.41747 6.84898 1.45241C6.74355 1.48736 6.64781 1.54654 6.56947 1.62519L1.62451 6.58243C1.54633 6.66069 1.48756 6.75613 1.45291 6.86112C1.41827 6.96611 1.40869 7.07774 1.42496 7.18709C1.44124 7.29644 1.4829 7.40047 1.54662 7.49086C1.61034 7.58125 1.69435 7.65549 1.79194 7.70766L7.40238 10.7064C7.56212 10.7921 7.68296 10.9356 7.74008 11.1074L8.79576 14.272L14.2671 8.80738L11.1001 7.75301C10.9275 7.69527 10.7838 7.57351 10.6985 7.41289L7.69893 1.79242Z" :fill="updatedNoteData.fix ? '#000' : '#959595'" />
          </svg>
        </button>
      </div>
    </div>
    <div class="modal__item">
      <p class="modal__label label">Заголовок</p>
      <input type="text" class="modal__input" v-model="updatedNoteData.title">
    </div>
    <div class="modal__item">
      <p class="modal__label label">Список дел</p>
      <div class="modal-item__wrapper" v-for="(item, index) in todoList" :key="item.id">
        <custom-checkbox :isActive="item.state" @click="item.state = !item.state" />
        <input type="text" class="modal__text" v-model="item.text">
        <button class="item__delete" @click="deleteTodo(index)">
          <img src="../assets/img/basket-icon.svg" alt="">
        </button>
        <button class="item__save" @click="addTodo">
          <img src="../assets/img/eclipse-plus.svg" alt="">
        </button>
      </div>
    </div>
    <div class="modal__item">
      <p class="modal__label label">Цвет заметки</p>
      <ul class="color-list">
        <li
            class="color__item"
            :class="{'selected-background': updatedNoteData.color === item || backgroundAmIndex === index}"
            v-for="(item, index) in colorList"
            :key="index"
            :style="{'background': item}"
            @click="updatedNoteData.color = item"
            @mouseenter="backgroundAmIndex = index"
            @mouseleave="backgroundAmIndex = null"
        ></li>
      </ul>
    </div>

    <div class="actions-wrapper">
      <button class="modal__delete link--main" @click="deleteModalState = true">Удалить</button>
      <div class="actions__right">
        <button class="modal__cancel link--main" @click="cancelModalState = true">Отменить</button>
        <button class="modal__save link--second" @click="editNote">Сохранить</button>
      </div>
    </div>

  </div>

  <modal-submit @modalCancel="deleteModalState = false" @modalSubmit="deleteNote" v-if="deleteModalState">
    <template v-slot:title>Удалить заметку?</template>
    <template v-slot:cancel>Отменить</template>
    <template v-slot:submit>Удалить</template>
  </modal-submit>

  <modal-submit @modalCancel="cancelModalState = false" @modalSubmit="cancelEdit" v-if="cancelModalState">
    <template v-slot:title>Отменить изменения?</template>
    <template v-slot:cancel>Закрыть</template>
    <template v-slot:submit>Отменить</template>
  </modal-submit>

</template>

<script>
import {reactive, ref} from 'vue';
import { useStore } from "vuex";
import router from "@/router";
import CustomCheckbox from "@/components/CustomCheckbox";
import ModalSubmit from "@/components/ModalSubmit";

export default {
  name: "NoteEdit",
  components: {
    CustomCheckbox,
    ModalSubmit
  },
  setup() {
    const store = useStore();

    const deleteModalState = ref(false);
    const cancelModalState = ref(false);

    // Saving the value of the edited note in a separate variable
    const updatedNoteData = reactive({
      ...store.state.editingNote
    });

    function editNote() {
      store.commit('editNote', updatedNoteData);
      router.push('/');
    }

    function cancelEdit() {
      router.push('/');
    }

    function deleteNote() {
      store.commit('deleteNote', { id: [updatedNoteData.id] })
      router.push('/');
    }

    const colorList = [
      '#E0E0E0',
      '#688AF7',
      '#B660DE',
      '#FC4DA8',
      '#EBD26A',
      '#30D38F',
      '#E49AFA',
      '#FF9A4D'
    ]

    const backgroundAmIndex = ref(null);

    const todoList = reactive(updatedNoteData.todoList);

    function addTodo() {
      todoList.push({
        id: todoList.length + 1,
        text: '',
        state: false
      });
    }

    function deleteTodo(index) {
      todoList.splice(index, 1);
    }

    const noteData = reactive({
      title: '',
      state: false,
      background: '',
      fix: false
    })

    return {
      updatedNoteData,
      colorList,
      editNote,
      backgroundAmIndex,
      addTodo,
      todoList,
      deleteTodo,
      noteData,
      cancelEdit,
      deleteNote,
      deleteModalState,
      cancelModalState
    }
  }
}
</script>

<style scoped>
.modal__wrapper {
  max-width: 450px;
  margin: 0 auto;
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 40px;
}

.header__actions {
  display: flex;
}

.action {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 30px;
  height: 30px;

  border: 1px solid #E0E0E0;
  border-radius: 8px;
}

.action--active {
  border: 1px solid #000;
}

.action:not(:last-child) {
  margin-right: 10px;
}

.modal__input {
  width: 100%;
  height: 40px;

  border: 1px solid #E0E0E0;
  border-radius: 14px;
}

.modal__item {
  margin-bottom: 35px;
}

.modal__text {
  width: 100%;
  height: 185px;

  border: 1px solid #E0E0E0;
  border-radius: 14px;
}

.color-list {
  display: grid;
  grid-template-columns: repeat(8, 40px);
  grid-column-gap: 15px;
  grid-row-gap: 15px;

  margin-top: 15px;
}

.color__item {
  height: 40px;
  border-radius: 8px;
  transition: .2s all ease;
  cursor: pointer;
}

.selected-background {
  transform: scale(1.15);
}

.modal-item__wrapper {
  display: flex;
  align-items: center;

  margin-bottom: 10px;
}

.modal__text {
  width: 100%;
  height: 40px;
  margin-left: 15px;

  border: 1px solid #E0E0E0;
  border-radius: 14px;
}

.item__delete {
  margin-left: 10px;
}

.item__delete img {
  width: 20px;
  height: 20px;
}

.item__save {
  margin-left: 10px;
}

.item__save img {
  width: 25px;
  height: 25px;
}

.actions-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal__delete {
  width: 30%;
}

.actions__right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal__cancel {
  width: 50%;
}

.modal__save {
  width: 50%;
  margin-left: 15px;
}

</style>