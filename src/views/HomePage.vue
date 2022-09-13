<template>
  <div class="notes">
    <div class="notes__header">
      <h2 class="notes__title title">Заметки</h2>
      <button class="notes__new link--main" @click="toggleModal(true)">Новая заметка</button>
    </div>
    <div class="notes__subheader">
      <div class="subheader__main">
        <header-actions />
      </div>
    </div>

    <div class="notes__list">
      <note-item
          v-for="(item, index) in sortedNoteList"
          :key="index"
          :notesData="item"
          @selectItem="item.state = !item.state"
      />
    </div>

    <modal-right @toggleModal="toggleModal($event)" v-if="modalState !== -1">
      <div class="modal__wrapper">
        <div class="modal__header">
          <h3 class="modal__title title">Новая заметка</h3>
          <div class="header__actions">
            <button
                class="action"
                :class="{'action--active': noteData.fix}"
                @click="noteData.fix = !noteData.fix"
            >
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.56487 0.624675C5.79991 0.389283 6.08695 0.212229 6.40294 0.107738C6.71892 0.00324567 7.05504 -0.0257713 7.38429 0.0230173C7.71354 0.0718059 8.02674 0.19704 8.29874 0.38866C8.57073 0.580279 8.79394 0.832942 8.95043 1.12635L11.8167 6.4974L15.8053 7.82528C15.9201 7.86337 16.0232 7.93016 16.1049 8.01929C16.1866 8.10842 16.2441 8.21693 16.272 8.33452C16.2999 8.4521 16.2972 8.57485 16.2642 8.6911C16.2311 8.80735 16.1689 8.91324 16.0834 8.9987L13.0369 12.0399L16.7928 15.7912L17 17L15.7882 16.7931L12.0338 13.0419L8.98874 16.0845C8.90317 16.1699 8.79716 16.2321 8.68076 16.2651C8.56437 16.298 8.44147 16.3007 8.32373 16.2729C8.206 16.2451 8.09735 16.1876 8.00811 16.106C7.91887 16.0245 7.85201 15.9214 7.81387 15.8067L6.48433 11.8245L1.12221 8.95618C0.829948 8.79959 0.578375 8.57694 0.387556 8.30601C0.196737 8.03508 0.0719547 7.72336 0.023159 7.39572C-0.0256348 7.06807 0.00291061 6.73357 0.10652 6.4189C0.210129 6.10423 0.385933 5.8181 0.619907 5.58333L5.56345 0.623258L5.56487 0.624675ZM7.69893 1.79242C7.64681 1.69445 7.57237 1.61007 7.48163 1.54608C7.39088 1.48209 7.28636 1.44028 7.17647 1.42401C7.06659 1.40774 6.95441 1.41747 6.84898 1.45241C6.74355 1.48736 6.64781 1.54654 6.56947 1.62519L1.62451 6.58243C1.54633 6.66069 1.48756 6.75613 1.45291 6.86112C1.41827 6.96611 1.40869 7.07774 1.42496 7.18709C1.44124 7.29644 1.4829 7.40047 1.54662 7.49086C1.61034 7.58125 1.69435 7.65549 1.79194 7.70766L7.40238 10.7064C7.56212 10.7921 7.68296 10.9356 7.74008 11.1074L8.79576 14.272L14.2671 8.80738L11.1001 7.75301C10.9275 7.69527 10.7838 7.57351 10.6985 7.41289L7.69893 1.79242Z" :fill="noteData.fix ? '#000' : '#959595'" />
              </svg>
            </button>
          </div>
        </div>
        <div class="modal__item">
          <p class="modal__label label">Заголовок</p>
          <input type="text" class="modal__input" v-model="noteData.title">
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
                :class="{'selected-background': noteData.background === item || backgroundAmIndex === index}"
                v-for="(item, index) in colorList"
                :key="index"
                :style="{'background': item}"
                @click="noteData.background = item"
                @mouseenter="backgroundAmIndex = index"
                @mouseleave="backgroundAmIndex = null"
            ></li>
          </ul>
        </div>

        <button class="modal__save link--second" @click="createNote">Сохранить заметку</button>

      </div>
    </modal-right>

  </div>
</template>

<script>
import NoteItem from "@/components/NoteItem.vue";
import ModalRight from "@/components/ModalRight.vue";
import HeaderActions from "@/components/HeaderActions";
import CustomCheckbox from "@/components/CustomCheckbox";
import { computed, reactive, ref } from "vue";
import { useStore } from 'vuex';

export default {
  name: "HomePage",
  components: {
    NoteItem,
    ModalRight,
    HeaderActions,
    CustomCheckbox
  },
  setup() {

    const store = useStore();

    // in this object we collect data and work with them
    const noteData = reactive({
      title: '',
      state: false,
      background: '',
      fix: false
    })

    // the function creates a note from the collected data and resets the values of the object
    function createNote() {
      if(noteData.title && todoList[0].text) {
        store.commit('createNote', {
          title: noteData.title,
          todoList: todoList,
          fix: noteData.fix,
          color: noteData.background,
        })

        for(let key in noteData) {
          if(key !== 'state') {
            noteData[key] = '';
          }
        }
        toggleModal(-1);
      }
    }

    // Sort notes based on whether they are pinned or not
    const sortedNoteList = computed(() => {
      const defaultList = store.state.noteList;
      return defaultList.sort((a, b) => {
        return b.fix - a.fix;
      });
    });

    // list of background colors for notes
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

    // the state of the modal window through which notes are created
    const modalState = ref(-1);

    function toggleModal(state) {
      modalState.value = state;
    }

    // a variable that helps implement note background selection animation
    const backgroundAmIndex = ref(null);

    // the object from which the todo list is collected
    const todoList = reactive([{
      id: 0,
      text: '',
      state: false
    }]);

    // function adds item to todo list
    function addTodo() {
      todoList.push({
        id: todoList.length + 1,
        text: '',
        state: false
      });
    }

    // function remove item from todo list
    function deleteTodo(index) {
      todoList.splice(index, 1);
    }

    return {
      sortedNoteList,
      colorList,
      modalState,
      toggleModal,
      noteData,
      createNote,
      backgroundAmIndex,
      todoList,
      addTodo,
      deleteTodo
    }

  }
}
</script>

<style scoped>
.notes__header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 30px;
}

.notes__subheader {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.subheader__main {
  display: flex;
  align-items: flex-end;
}

.notes__list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 20px;

  margin-top: 40px;
}

.modal__wrapper {
  padding-bottom: 100px;
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

.add-photo img {
  margin-bottom: 15px;
}

.add-photo span {
  font-size: 16px;
  line-height: 20px;
}

.modal__save {
  width: 100%;
  margin-top: 70px;
}

.delete-submit {
  position: fixed;
  top: 50%;
  left: 50%;

  padding: 15px 30px;

  transform: translateX(-50%) translateY(-50%);
  border-radius: 11px;
  box-shadow: 0px 0px 8px 5px rgba(34, 60, 80, 0.2);
}

.delete__title {
  margin-bottom: 25px;

  font-size: 18px;
  text-align: center;
}

.delete__wrapper {
  display: flex;
  align-items: center;
}

.delete__cancel {
  margin-right: 20px;
}

</style>