<template>
  <div class="navigation">
    <button @click="$emit('prev')">{{ $t('previous') }}</button>
    <p>{{$t(monthNames[currentMonth.getMonth()]) }} {{currentMonth.getFullYear()}}</p>
    <button @click="$emit('next')">{{$t('next')}}</button>
  </div>
</template>

<script>
export default {
  props: ["currentMonth"],
  data() {
    return {
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 15px;
  height: 40px;
  background: #434343;
}

p {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.6);
}
</style>