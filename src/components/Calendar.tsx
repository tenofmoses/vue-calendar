import { Component, Prop, Vue } from 'vue-property-decorator';
import { VueComponent } from '../shims-vue';
import { RootStore } from '@/store';
import { useStore } from 'vuex-simple';
import Tasks from './Tasks';
const nextArrow = require('./../assets/nextArrow.svg')
const prevArrow = require('./../assets/prevArrow.svg')

import styles from './Calendar.css?module'

@Component
export default class Calendar extends VueComponent {
    public store: RootStore = useStore(this.$store);

    week = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    monthName = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    
    date = new Date;
    today = this.date.toDateString()
    currentDay = this.date.getDate();
    currentMonth = this.date.getMonth(); 
    currentYear = this.date.getFullYear();


    getPastMoth = function(year:number, month:number) {
        let pastMoth = [];
        let lastDay = new Date(year, month, 0).getDay();
        
        for (let day = 0; day > -lastDay; day-- ) {
            pastMoth.push(new Date(year, month, day));
        };
        return pastMoth.reverse();
    };

    getCurrentMoth = function(year:number, month:number) {
        let currentMoth = [];
        let lastDay = new Date(year, month + 1, 0).getDate();

        for (let day = 0; day > -lastDay; day-- ) {
            currentMoth.push(new Date(year, month + 1, day));
        };
        return currentMoth.reverse();
    };

    getNextMoth = function(year:number, month:number) {
        let nextMoth = [];
        let lastDay = new Date(year, month + 1, 0).getDay();

        if (lastDay !== 0) {
            for (let day = 1; day <= 7 - lastDay; day++ ) {
                nextMoth.push(new Date(year, month + 1, day));
            };
        };
        return nextMoth.reverse();
    };


    pastMoth = this.getPastMoth(this.currentYear, this.currentMonth);
    currentMoth = this.getCurrentMoth(this.currentYear, this.currentMonth);
    nextMoth = this.getNextMoth(this.currentYear, this.currentMonth);

    selectDay(day:Date) {
        this.today = day.toDateString()
    }

    getPrevMonth() {
        this.currentYear = this.currentMonth == 0 ? this.currentYear - 1 : this.currentYear
        this.currentMonth = this.currentMonth == 0 ? 11 : this.currentMonth - 1

        this.pastMoth = this.getPastMoth(this.currentYear, this.currentMonth);
        this.currentMoth = this.getCurrentMoth(this.currentYear, this.currentMonth);
        this.nextMoth = this.getNextMoth(this.currentYear, this.currentMonth);
    }

    getNextMonth() {
        this.currentYear = this.currentMonth == 11 ? this.currentYear + 1 : this.currentYear
        this.currentMonth = this.currentMonth == 11 ? 0 : this.currentMonth + 1

        this.pastMoth = this.getPastMoth(this.currentYear, this.currentMonth);
        this.currentMoth = this.getCurrentMoth(this.currentYear, this.currentMonth);
        this.nextMoth = this.getNextMoth(this.currentYear, this.currentMonth);
    }

    render() {
        return (
            <div class={styles.calendarWrapper}>
                <div class={styles.calendar}>
                    <div class={styles.header}>
                        <div class={styles.headerDate}>
                            <div class={styles.headerDateMonth}>{this.monthName[this.currentMonth]}</div>
                            <div>{this.currentYear}</div>
                        </div>
                        <div class={styles.arrowWrapper}>
                            <div class={[styles.arrow, styles.prevArrow]} onclick={this.getPrevMonth}><img src={prevArrow} /></div>
                            <div class={[styles.arrow, styles.nextArrow]} onclick={this.getNextMonth}><img src={nextArrow}/></div>
                        </div>
                    </div>
                    <div class={styles.month}>
                        {this.week.map(item => <div class={styles.monthHead}>{item}</div>)}
                        {this.getPastMoth(this.currentYear, this.currentMonth).map(item => <div class={styles.otherDays}>{item.getDate()}</div>)}
                        {this.getCurrentMoth(this.currentYear, this.currentMonth).map(item => {
                            return (item.toDateString() == this.today
                                ? <div class={styles.currentDay}>{item.getDate()}</div> 
                                : <div class={[this.store.todos[item.toDateString()] ? styles.daysWithTodo : null, styles.currentAllDays]} onclick={this.selectDay.bind(this, item)}>
                                    {item.getDate()}
                                </div>
                            )})}
                        {this.getNextMoth(this.currentYear, this.currentMonth).map(item => <div class={styles.otherDays}>{item.getDate()}</div>)}
                    </div>
                </div>
                <Tasks today={this.today} />
            </div>
        )
    };
};
