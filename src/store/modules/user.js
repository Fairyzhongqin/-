export default {
  namespaced: true,
  state: {
    id: 0,
    name: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
      console.log('不安胡', id)
    },
    updateName (state, name) {
      state.name = name
      console.log('不安胡', name)
    }
  }
}
