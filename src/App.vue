<template>
  <div id="app">
    <calendar />
  </div>
</template>

<script>
import Calendar from "./components/Calendar";

export default {
  name: "app",
  components: {
    Calendar
  }
};
</script>

<style>
@import "./assets/style.css";

#app {
  height: 100%;
}
</style>
