<template>
  <div id="calendar">
    <navigation :currentMonth="currentMonth" @prev="prevMonth" @next="nextMonth" />

    <div class="table table-head days">
      <div v-for="day in daysNames" :key="day">{{day}}</div>
    </div>
    <div class="table table-body">
      <div class="week" v-for="week in month">
        <div class="day" v-for="day in week" @click="addEvent(day)">
          <p>{{day.getDate()}}</p>
          <div class="events" v-if="hasEvents(day)">
            <div
              class="event"
              v-for="event in getDayEvents(day)"
              :key="event.id"
              @click="editEvent(event)"
            >
              <p>{{event.title}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <event-form
      v-if="showForm"
      :eventDate="selectedDate"
      :event="selectedEvent"
      @close="closeForm"
    />
  </div>
</template>

<script>
import EventForm from "./EventForm";
import Navigation from "./Navigation";

const clientKey = "calendar-client";

export default {
  components: { EventForm, Navigation },
  data() {
    return {
      currentMonth: new Date(),
      selectedDate: null,
      selectedEvent: null,
      daysNames: ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"],
      showForm: false,
      events: []
    };
  },
  mounted() {
    if (localStorage[clientKey]) {
      this.events = JSON.parse(localStorage.getItem(clientKey));
    }
    window.addEventListener("storage", this.onStorageEvent, false);
  },
  computed: {
    month() {
      return this.calendarMatrix(this.currentMonth);
    }
  },
  methods: {
    closeForm() {
      this.events = JSON.parse(localStorage.getItem(clientKey));
      this.showForm = false;
      this.selectedEvent = null;
    },
    editEvent(event) {
      this.selectedEvent = event;
      this.showForm = true;
    },
    getDayEvents(day) {
      if (!this.events) return [];
      let date = day.toISOString().slice(0, 10);
      return this.events.filter(x => x.date === date);
    },
    hasEvents(day) {
      return this.events
        ? this.events.map(x => x.date).includes(day.toISOString().slice(0, 10))
        : false;
    },
    addEvent(day) {
      this.selectedDate = day;
      this.showForm = true;
    },
    prevMonth() {
      var tmpDate = this.currentMonth;
      var tmpMonth = tmpDate.getMonth() - 1;
      this.currentMonth = new Date(tmpDate.setMonth(tmpMonth));
    },
    nextMonth() {
      var tmpDate = this.currentMonth;
      var tmpMonth = tmpDate.getMonth() + 1;
      this.currentMonth = new Date(tmpDate.setMonth(tmpMonth));
    },
    calendarMatrix(date) {
      var calendarMatrix = [];

      var startDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      var startDow = (startDay.getDay() + 6) % 7;
      var endDow = (lastDay.getDay() + 6) % 7;

      startDay.setDate(startDay.getDate() - startDow);
      lastDay.setDate(lastDay.getDate() + (6 - endDow));

      var week = [];
      while (startDay <= lastDay) {
        week.push(new Date(startDay));
        if (week.length === 7) {
          calendarMatrix.push(week);
          week = [];
        }
        startDay.setDate(startDay.getDate() + 1);
      }

      return calendarMatrix;
    },
    onStorageEvent() {
      // Update events by other sessions
      this.events = JSON.parse(localStorage.getItem(clientKey));
    }
  }
};
</script>

<style lang="scss" scoped>
#calendar {
  height: 100%;
  width: 95vw;
  margin: 0 auto;
}

.table {
  background-color: #333;
  display: flex;
}

.table-body {
  height: calc(100% - 115px);
  border-left: #4b4c4a 1px solid;
  border-bottom: #4b4c4a 1px solid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-height: 80vh;
  display: grid;
  grid-auto-rows: 1fr;
}

.days {
  display: flex;
  height: 20px;
  padding: 10px;
  color: rgba(255, 255, 255, 0.6);

  > div {
    flex: 1 1 0px;
    text-align: center;
  }
}
.week {
  display: flex;
  flex: 1;
  min-height: 60px;
  border-top: #4b4c4a 1px solid;
  div:nth-child(n + 6) {
    background-color: #434346;
  }
}

.day {
  flex: 1 1 0px;
  border-right: #4b4c4a 1px solid;
  background-color: #434343;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    padding-left: 5px;
    padding-top: 5px;
  }

  .event p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px 5px;
    margin: 5px;
    background-color: #91c33b;
    color: #141414;
    font-size: 12px;

    &:hover {
      background-color: #91c34f;
    }
  }
}
</style>