import { createRouter, createWebHashHistory } from 'vue-router'

const LessonsPage = () => import('../views/LessonsPage.vue')
const CartPage = () => import('../views/CartPage.vue')

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: '/', name: 'Lessons', component: LessonsPage },
		{ path: '/cart', name: 'Cart', component: CartPage },
	],
})

export default router
