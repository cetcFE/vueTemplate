<template>
  <div>
    <router-view/>
    <j-alert/>
    <j-confirm/>
  </div>
</template>

<script>
import JAlert from '@/components/JAlert'
import JConfirm from '@/components/JConfirm'
export default {
  name: 'App',
  data () {
    return {
      defaultPage: false,
      pageName: '首页'
    }
  },
  components: {
    JAlert,
    JConfirm
  }
}
</script>

<style>
@import "assets/css/message-box.css";
</style>
