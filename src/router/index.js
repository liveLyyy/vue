import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Rights from '@/components/power/Rights'
import Categorys from '@/components/power/Categorys'
import Articles from '@/components/power/Articles'
import Postarticles from '@/components/power/Postarticles'
import ShowArticle from '@/components/power/ShowArticle'
import EditArticle from '@/components/power/EditArticle'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },{
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          name: 'Welcome',
          component: Welcome
        }, {
          path: '/users',
          name: 'Users',
          component: Users
        }, {
          path: '/rights',
          name: 'Rights',
          component: Rights
        }, {
          path: '/categorys',
          name: 'Categorys',
          component: Categorys
        }, {
          path: '/articles',
          name: 'Articles',
          component: Articles
        },{
          path: '/postarticles',
          name: 'Postarticles',
          component: Postarticles
        },{
          path: '/showArticle',
          name: 'ShowArticle',
          component: ShowArticle
        },{
          path: '/editArticle',
          name: 'EditArticle',
          component: EditArticle
        }
      ]
    }
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to,将要访问的数据
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行 next()放行 ，next('/login')强制跳转
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()

})

export default router
