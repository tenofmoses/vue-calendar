import { Component, Prop, Vue } from 'vue-property-decorator';
import { VueComponent } from '../shims-vue';
import { RootStore } from '@/store';
import { useStore } from 'vuex-simple';

import styles from './Tasks.css?module'
import {Todo} from '@/store'
interface Props {
    today: string
}

@Component
export default class Tasks extends VueComponent<Props> {
    @Prop()
    private today!:  string;
    public store: RootStore = useStore(this.$store);

    showForm = true
    editText = false
    todo = {time: '', text: '', isCompleted: false}

    checkedHandler(item:Todo){
        this.store.toggleTodo([this.today, item.id])
    }

    formHandler() {
        this.showForm = !this.showForm
    }

    timeValidation(e:any) {
        this.asyncValidate(e.target.value).then(res => {
            if (res) {
                this.editText = true
                this.todo.time = e.target.value
            } else {
                this.editText = false
            } 
        })
    }

    asyncValidate(value:string) {  
        return new Promise((resolve) => {
            setTimeout(() => {
                if (value) resolve(true)
            }, 2000) 
        })
    }

    changeText(e:any) {
        this.todo.text = e.target.value
    }

    onFormSubmit(e:any) {
        e.preventDefault()
        this.store.addTodo([this.today, this.todo])
        this.todo.time = ''
        this.todo.text = ''
    }

    get currentTodos() {
        return this.store.todos[this.today];
    }

    render() {
        return (
            <div class={styles.tasks}>
                <div class={styles.header}>События</div>
                <div class={styles.tasksList}>
                    {this.currentTodos && this.currentTodos.map((item : Todo)=> {
                        return (
                            <div class={styles.tasksListItem} id={item.id}  onclick={() => {this.checkedHandler(item)}}>
                                <input type="checkbox" id={item.id} class={styles.checkbox} checked={item.isCompleted} />
                                <label for={item.id} >{item.time} {item.text}</label>
                            </div>
                        )
                    })}
                </div>
                { this.showForm
                    ? <form onsubmit={this.onFormSubmit}>
                         <div class={styles.inputWrapper}>
                            <input type="time" class={[styles.input, styles.timeInput]} onchange={this.timeValidation} value={this.todo.time} />                        
                            <input type="text" 
                                placeholder="Текст" 
                                class={[styles.input, styles.textInput]} 
                                disabled={!this.editText} 
                                value={this.todo.text}
                                onchange={this.changeText}/>
                        </div>
                        <div class={styles.buttonWrapper}>
                            <button type="reset" class={[styles.button, styles.buttonCancel]} onclick={this.formHandler}>Отмена</button>
                            <button class={[styles.button]} disabled={!this.todo.time || !this.todo.text} >Сохранить</button>
                        </div>
                    </form>
                    : <div class={styles.buttonWrapper}><button class={styles.button} onclick={this.formHandler}>Добавить</button></div>}
            </div>
        )
    };
};
