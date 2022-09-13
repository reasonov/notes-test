import { createStore } from "vuex";

export default createStore({
  state: {
    noteList: [],
    editingNote: null
  },
  mutations: {
    // Adding data from local storage
    setNoteFromStorage(state, payload) {
      payload.forEach((item) => {
        state.noteList.push({
          ...item
        });
      })
    },
    // select or deselect a note
    noteToggle(state, payload) {
      const index = state.noteList.findIndex(item => item.id === payload.id);

      state.noteList[index].selected = payload.state;
    },
    // pin a note
    fixNote(state, payload) {
      const index = state.noteList.findIndex(item => item.id === payload.id);

      state.noteList[index].fix = payload.fix;
    },
    // creating a note
    createNote(state, note) {
      const id = Math.floor(Math.random() * 1000);
      state.noteList.push({
        id: id,
        ...note
      })
    },
    // deleting a note
    deleteNote(state, payload) {
      payload.id.forEach((payloadId) => {
        const index = state.noteList.findIndex(item => item.id === payloadId);
        state.noteList.splice(index, 1);
        state.editingNote = null;
      })
    },
    // adding an editable note
    setEditNote(state, payload) {
      state.editingNote = payload;
    },
    // note editing
    editNote(state, payload) {
      const index = state.noteList.findIndex(item => item.id === payload.id);

      state.noteList[index] = payload;
      state.editingNote = null;
    }
  }
})