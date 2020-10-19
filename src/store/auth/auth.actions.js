import firebase from 'firebase/app'
import UsersDB from '@/firebase/users-db'

const actions = {
  signup: async ({ commit }, form) => {
    commit('SET_LOADING', true)

    try {
      // signup with email and password
      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(form.email, form.password)

      // create a user in firestore `users` table
      const userDb = new UsersDB()
      const newUser = {
        email: form.email,
        name: form.name,
      }
      userDb.create(newUser, user.uid)

      localStorage.setItem('uid', user.uid)
      
      commit('SET_LOADING', false)
    } catch (err) {
      commit('SET_ERROR', err)
      commit('SET_LOADING', false)
    }
  },

  // eslint-disable-next-line
  login: async ({ commit }, form) => {
    commit('SET_LOADING', true)

    try {
      // signup with email and password
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(form.email, form.password)

      localStorage.setItem('uid', user.uid)

      commit('SET_LOADING', false)
    } catch (err) {
      commit('SET_ERROR', err)
      commit('SET_LOADING', false)
    }
  },

  /*fetchProfile: async ({ commit }, firebaseAuthUser) => {
    commit('SET_LOADING', true)
    const userFromFirebase = await new UsersDB().read(firebaseAuthUser.uid)

    localStorage.setItem('uid', firebaseAuthUser.uid)

    commit('SET_USER', userFromFirebase)
    commit('SET_LOADING', false)
  },*/

  logout: async ({ commit }) => {
    await firebase.auth().signOut()
    localStorage.removeItem('uid')
    commit('SET_USER', null)
  },
}

export default actions
