import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SchemaEdit from '@/views/SchemaEdit/Demo.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/SchemaEdit/',
    name: 'SchemaEdit',
    component: () => import(/* webpackChunkName: "about" */ '../views/SchemaEditView.vue')
  },
  {
    path: '/SchemaSpecify/',
    name: 'SchemaSpecify',
    component: () => import(/* webpackChunkName: "about" */ '../views/SchemaSpecifyView.vue')
  },
  {
    path: '/KnowledgeGraph/',
    name: 'KnowledgeGraph',
    component: () => import(/* webpackChunkName: "about" */ '../views/KnowledgeGraphView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
