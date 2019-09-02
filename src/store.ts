import Vue from 'vue'
import Vuex from 'vuex'
import { State, createVuexStore, Mutation } from 'vuex-simple';
import uuid from 'uuid/v4';
Vue.use(Vuex)

export type Todo = {
  id: string
  time: string,
  text: string,
  isCompleted: boolean
}
export class RootStore {
  @State()
  public todos : {[key: string]: any}  = {};

  @Mutation()
  public addTodo([date, {time, text, isCompleted}] : [any, { time: string, text: string, isCompleted: boolean}]) {
    const newTodo ={id: uuid(), time, text, isCompleted};
    if (date in this.todos) {
      this.todos[date].push(newTodo);
    } else {
      Vue.set(this.todos, date, [newTodo]);
    }
  }
  @Mutation()
  public toggleTodo([date, id] : [string, string]) {
    let currentTodo = this.todos[date].find((t: Todo) => t.id == id)
    currentTodo.isCompleted = !currentTodo.isCompleted
  }
}


const instance = new RootStore();

// create and export our store
export default createVuexStore(instance, {
  strict: false,
  modules: {},
  plugins: []
});
 