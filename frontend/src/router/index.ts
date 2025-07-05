import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginForm from "@/components/LoginForm.vue";
import SignupForm from "@/components/SignupForm.vue";
import DashboardView from "@/views/DashboardView.vue";
import ExpenseView from "@/views/ExpenseView.vue";
import IncomeView from "@/views/IncomeView.vue";
import BudgetView from "@/views/BudgetView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue'),
      component: LoginForm,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupForm,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: ExpenseView,
      meta: { requiresAuth: true },
    },
    {
      path: '/incomes',
      name: 'incomes',
      component: IncomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: BudgetView,
      meta: { requiresAuth: true },
    }
  ],
})

let isInitialized = false

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!isInitialized) {
    await authStore.initialize()
    isInitialized = true
  }

  if (to.meta.requiresAuth) {
    // ここが原因で、リロード時にloginページに遷移されてしまう
    // if (!authStore.session && !authStore.loading) {
    //   await authStore.initialize()
    // }
    if (!authStore.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else if ( to.path === '/login' && authStore.isAuthenticated) {
    // ログイン済みユーザーがログインページにアクセスした場合
    next('/dashboard')
  } else {
    next()
  }
})

export default router
