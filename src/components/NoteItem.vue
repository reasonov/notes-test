<template>
  <article class="notes-item" :style="{'background': notesData.color}">
    <h3 class="notes__title">{{ notesData.title }}</h3>

    <ul class="notes__todo">
      <li class="todo__item" v-for="item in cutTodo" :key="item.id">
        <custom-checkbox :isActive="item.state" />
        <p class="todo__text">{{ item.text }}</p>
      </li>
    </ul>

    <div class="notes__actions">
      <button class="action action1" @click="fixNote">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.56487 0.624675C5.79991 0.389283 6.08695 0.212229 6.40294 0.107738C6.71892 0.00324567 7.05504 -0.0257713 7.38429 0.0230173C7.71354 0.0718059 8.02674 0.19704 8.29874 0.38866C8.57073 0.580279 8.79394 0.832942 8.95043 1.12635L11.8167 6.4974L15.8053 7.82528C15.9201 7.86337 16.0232 7.93016 16.1049 8.01929C16.1866 8.10842 16.2441 8.21693 16.272 8.33452C16.2999 8.4521 16.2972 8.57485 16.2642 8.6911C16.2311 8.80735 16.1689 8.91324 16.0834 8.9987L13.0369 12.0399L16.7928 15.7912L17 17L15.7882 16.7931L12.0338 13.0419L8.98874 16.0845C8.90317 16.1699 8.79716 16.2321 8.68076 16.2651C8.56437 16.298 8.44147 16.3007 8.32373 16.2729C8.206 16.2451 8.09735 16.1876 8.00811 16.106C7.91887 16.0245 7.85201 15.9214 7.81387 15.8067L6.48433 11.8245L1.12221 8.95618C0.829948 8.79959 0.578375 8.57694 0.387556 8.30601C0.196737 8.03508 0.0719547 7.72336 0.023159 7.39572C-0.0256348 7.06807 0.00291061 6.73357 0.10652 6.4189C0.210129 6.10423 0.385933 5.8181 0.619907 5.58333L5.56345 0.623258L5.56487 0.624675ZM7.69893 1.79242C7.64681 1.69445 7.57237 1.61007 7.48163 1.54608C7.39088 1.48209 7.28636 1.44028 7.17647 1.42401C7.06659 1.40774 6.95441 1.41747 6.84898 1.45241C6.74355 1.48736 6.64781 1.54654 6.56947 1.62519L1.62451 6.58243C1.54633 6.66069 1.48756 6.75613 1.45291 6.86112C1.41827 6.96611 1.40869 7.07774 1.42496 7.18709C1.44124 7.29644 1.4829 7.40047 1.54662 7.49086C1.61034 7.58125 1.69435 7.65549 1.79194 7.70766L7.40238 10.7064C7.56212 10.7921 7.68296 10.9356 7.74008 11.1074L8.79576 14.272L14.2671 8.80738L11.1001 7.75301C10.9275 7.69527 10.7838 7.57351 10.6985 7.41289L7.69893 1.79242Z" :fill="notesData.fix ? '#000' : '#fff'" />
        </svg>
      </button>
      <router-link class="action action2" to="/note-edit" @click="goToEdit">
        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.70769 10.9444L5.205 12.8936L9.24346 6.14159L5.74731 4.19241L1.70885 10.9455L1.70769 10.9444ZM1.27731 11.9914L1.87038 14.5721L4.48269 13.7768L1.27731 11.9914ZM6.32308 3.22785L9.81923 5.17703L10.8415 3.46954L7.34423 1.52036L6.32308 3.22785ZM0 11.5737L6.92308 0L12.4177 3.06189L5.49577 14.6367H5.49692L1.01769 16L0 11.5737ZM6.92308 15.9989V14.8851H15V15.9989H6.92308Z" fill="#fff"/>
        </svg>
      </router-link>
    </div>

    <custom-checkbox class="notes__checkbox" :isActive="notesData.selected" @click="noteToggle" />

  </article>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import router from "@/router";
import CustomCheckbox from "@/components/CustomCheckbox";

export default {
  name: "NoteItem",
  components: {
    CustomCheckbox,
  },
  props: {
    notesData: {
      type: Object,
      required: true
    }
  },
  setup(props) {

    const store = useStore();

    // function to switch the state of the note. Chosen or not
    function noteToggle() {
      store.commit('noteToggle', {
        id: props.notesData.id,
        state: !props.notesData.selected
      })
    }

    // pinning a note
    function fixNote() {
      store.commit('fixNote', {
        id: props.notesData.id,
        fix: !props.notesData.fix
      })
    }

    // we fix which note will be changed and go to the page for editing
    function goToEdit() {
      store.commit('setEditNote', props.notesData);
      router.push('/note-edit');
    }

    // truncates the todo list to two items
    const cutTodo = computed(() => {
      return props.notesData.todoList.filter((item) => {
        return item.id <= 2;
      })
    })

    return { noteToggle, fixNote, goToEdit, cutTodo }

  }
}
</script>

<style scoped>

.notes-item {
  position: relative;

  padding: 30px 20px;
  padding-bottom: 45px;

  box-shadow: 0px 0px 4px -2px rgba(24, 39, 75, 0.18), 0px 3px 16px -2px rgba(24, 39, 75, 0.18);
  border-radius: 8px;
  box-sizing: border-box;
}

.notes__title {
  margin-bottom: 10px;

  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
}

.todo__item {
  display: flex;
  align-items: center;
}

.todo__item:not(:last-child) {
  margin-bottom: 10px;
}

.todo__text {
  margin-left: 10px;

  font-size: 14px;
  font-weight: 300;
  line-height: 18px;
}

.notes__actions {
  position: absolute;
  top: 10px;
  right: 15px;

  display: flex;
}

.action1 {
  margin-right: 15px;
}

.notes__checkbox {
  position: absolute;
  bottom: 10px;
  right: 15px;
}
</style>