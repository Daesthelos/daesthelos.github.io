/*
//Default mode
import Vuex from 'vuex'

const createStore = () => {
    return new Vuex.Store({
        state: () => ({
            counter : 0
        }),
        mutations: {
            increment (state) {
                state.counter++
            }
        }
    })
}
*/

//Modules mode
export const state = () => ({
    counter : 0
})

export const mutations = {
    increment (state) {
        state.counter++
    }
}
