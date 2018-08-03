import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import BetterPicker from '@/components/betterPicker'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      name: 'css',
      path: '/css',
      component: BetterPicker
    }
  ]
})
