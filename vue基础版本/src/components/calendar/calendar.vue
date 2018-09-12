<template>
  <v-touch id="calendar" @swipeleft="$emit('nextMonth')" @swiperight="$emit('prevMonth')">
    <div v-html="template"></div>
  </v-touch>
</template>

<script type='text/ecmascript-6'>
export default {
  props: [
    'template'
  ]
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
