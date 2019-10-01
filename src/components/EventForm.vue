<template>
  <div class="overlay">
    <form @submit="onSubmit($event)" class="form">
      <div>
        <label for="title" class="control-label">{{$t('Title')}}</label>
        <input
          name="title"
          type="text"
          minlength="4"
          maxlength="100"
          required
          id="name"
          v-model="form.title"
          :disabled="locked"
        />
      </div>
      <div>
        <label for="date" class="control-label">{{$t('date')}}</label>
        <input type="date" name="date" v-model="form.date" :disabled="locked" />
      </div>

      <div>
        <label for="time" class="control-label">{{$t('time')}}</label>
        <input type="time" name="time" id="time" v-model="form.time" :disabled="locked" />
      </div>

      <button @click.prevent="addGuests = true">{{$t('Add Guests')}}</button>
      <div v-if="addGuests">
        <label for="guests" class="control-label"></label>
        <input
          placeholder="Guest name"
          type="text"
          name="guests"
          id="guests"
          v-on:keydown.enter="addGuest($event)"
          :disabled="locked"
        />
      </div>

      <div class="guest" v-if="form.guests.length">
        <p>{{$t('guests list')}}</p>
        <div class="guest-name" v-for="guest in form.guests" :key="guest">{{guest}}</div>
      </div>

      <div>
        <label for="description" class="control-label">{{$t('description')}}</label>
        <input
          type="description"
          name="description"
          id="description"
          v-model="form.desc"
          :disabled="locked"
        />
      </div>

      <div>
        <p>{{$t('locked')}}</p>
        <label class="switch">
          <input type="checkbox" v-model="form.locked" :disabled="locked" />
          <span class="slider"></span>
        </label>
      </div>

      <button v-if="!locked">{{$t('save')}}</button>
      <button @click.prevent="$emit('close')">{{$t('cancel')}}</button>
    </form>
  </div>
</template>

<script>
const clientKey = "calendar-client";
const MAX_POSSIBLE_EVENTS = 5;

export default {
  props: ["eventDate", "event"],
  data() {
    return {
      form: {
        title: "",
        date: "",
        time: null,
        desc: "",
        guests: [],
        locked: false
      },
      locked: false,
      addGuests: false
    };
  },
  mounted() {
    if (this.event) {
      this.locked = this.event.locked;
      let { title, date, time, desc, guests, locked } = this.event;
      this.form.title = title;
      this.form.date = date;
      this.form.time = time;
      this.form.desc = desc;
      this.form.guests = guests;
      this.form.locked = locked;
    } else {
      this.form.date = this.eventDate.toISOString().slice(0, 10);
    }
  },
  methods: {
    addGuest(event) {
      let name = event.target.value;
      if (!this.form.guests.includes(name)) this.form.guests.push(name);
    },
    onSubmit(e) {
      e.preventDefault();
      let oldList = JSON.parse(localStorage.getItem(clientKey)) || [];
      if (!Array.isArray(oldList)) oldList = [oldList];

      this.event ? this.updateEvent(oldList) : this.addEvent(oldList);

      this.$emit("close");
    },
    addEvent(oldList) {
      if (this.moreThanMax(oldList)) {
        alert("Can't save event, selected date stores maximum of 5 events");
        return;
      }

      let newList = [...oldList, this.form];
      newList.forEach(function(event, index) {
        event.id = index;
      });
      localStorage.setItem(clientKey, JSON.stringify(newList));
    },
    updateEvent(list) {
      let item = list.find(x => x.id === this.event.id);

      item.title = this.form.title;
      item.date = this.form.date;
      item.time = this.form.time;
      item.desc = this.form.desc;
      item.guests = this.form.guests;
      item.locked = this.form.locked;

      localStorage.setItem(clientKey, JSON.stringify(list));
    },
    moreThanMax(list) {
      let count = list
        .map(x => x.date)
        .reduce((prv, cur) => ((prv[cur] = ++prv[cur] || 1), prv), {})[
        this.form.date
      ];

      return count >= MAX_POSSIBLE_EVENTS;
    }
  }
};
</script>

<style lang="scss">
.overlay {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 22, 0.2);
}

form {
  min-width: 25%;
  margin: auto;
  background: #fff;
  padding: 25px;
  border-radius: 4px;
  box-shadow: 0px 0px 2px 0px #fff;

  button {
    border: none;
    font-size: 16px;
    background: none;
    cursor: pointer;
    margin: 5px 10px 0 0;
  }
}

label {
  display: inline-block;
  max-width: 100%;
  margin: 5px 0;
  font-weight: 700;
}

input {
  display: block;
  width: 100%;
  padding: 6px 0;
  font-size: 14px;
  color: #555;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.lock {
  display: flex;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
</style>