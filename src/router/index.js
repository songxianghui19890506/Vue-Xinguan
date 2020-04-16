import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/role/Roles.vue'
import Menus from '../components/menu/Menus.vue'
import Departments from '../components/department/Departments.vue'
import ProductCategorys from '../components/product/ProductCategorys.vue'
import Suppliers from '../components/product/Suppliers.vue'
import Products from '../components/product/Products.vue'
import InStocks from '../components/product/InStocks.vue'
import AddStocks from '../components/product/AddStocks.vue'
import GobalMap from '../components/map/map.vue'
import Swagger from '../components/doc/Swagger.vue'
import Druid from '../components/doc/Druid.vue'
import LoginLog from '../components/log/LoginLog.vue'
import Message from '../components/message/Message.vue'
import Logs from '../components/log/Logs.vue'
import Consumers from '../components/product/Consumers.vue'
import Stocks from'../components/product/Stocks.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
 
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users,
    }
    , {
      path: '/roles',
      component: Roles,
    }
    , {
      path: '/menus',
      component: Menus,
    }
    , {
      path: '/departments',
      component: Departments,
    }
  
    , {
      path: '/productCategorys',
      component: ProductCategorys,
    }
  
    , {
      path: '/suppliers',
      component: Suppliers,
    }
    , {
      path: '/products',
      component: Products,
    }
    , {
      path: '/inStocks',
      component: InStocks,
    }
    , {
      path: '/inStocks/addStocks',
      component: AddStocks,
    },
    {
      path: '/map',
      component: GobalMap
    },
  
    {
      path: '/swagger',
      component: Swagger
    },
  
    {
      path: '/druid',
      component: Druid
    },
    {
      path: '/loginLog',
      component: LoginLog
    },
  
    {
      path: '/messages',
      component: Message
    },
    {
      path: '/logs',
      component: Logs
    },
  
    {
      path: '/consumers',
      component: Consumers
    },
  
    {
      path: '/stocks',
      component: Stocks
    },
  
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
//路由导航守卫
router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('JWT_TOKEN');
  if (to.path == '/login') {
    if(!token){
      return next();
    }else{
      next({path: '/home'})
    }
  }
  if (!token) {
    return next('/login');
  } else {
    //判断是否有访问该路径的权限
    // const urls = window.localStorage.getItem('urls');
    // if(urls.indexOf(to.path) > -1){
    //   //则包含该元素
    //   return next();
    // }else{
    //   alert("非法访问");
    // }

    return next();
  }
})

export default router
