<template>
  <div class="main-layout">
    <router-view />
  </div>
</template>

<script>
import { watch, onBeforeMount } from 'vue';
import { useStore } from "vuex";

export default {
  name: 'App',
  setup() {
    const store = useStore();

    // before mounting, we add the value from the local storage to the list of notes
    onBeforeMount(() => {
      if(window.localStorage.getItem('noteList')) {
        store.commit('setNoteFromStorage', JSON.parse(window.localStorage.getItem('noteList')))
      }
    })

    // when changing the list of notes in the vuex storage, overwrite the value in the local storage
    watch(() => store.state.noteList, () => {
      window.localStorage.setItem('noteList', JSON.stringify(store.state.noteList));
    }, { deep: true })
  }
}
</script>

<style scoped>
.main-layout {
  max-width: 960px;
  padding: 40px 60px;
  margin: 0 auto;
}
</style>

<style src="@/assets/main.css"></style>
