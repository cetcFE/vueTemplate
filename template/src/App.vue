<template>
  <div>
    <div>
      <router-view/>
    </div>

    <jalert/>
    <jconfirm/>
    <loading/>
  </div>
</template>

<script>
import Jalert from '@/components/Jalert'
import Jconfirm from '@/components/Jconfirm'
import Loading from '@/components/Loading'
export default {
  name: 'App',
  data () {
    return {
      defaultPage: false,
      pageName: '首页'
    }
  },
  components: {
    Jalert,
    Jconfirm,
    Loading
  }
}
</script>

<style>
@import "assets/css/message-box.css";
</style>
