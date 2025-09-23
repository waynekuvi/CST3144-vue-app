import { reactive, computed } from 'vue'

export const store = reactive({
	lessons: [],
	cartItems: [], // { _id, topic, location, price, spaceRemainingAtAdd }
	sortBy: 'topic', // 'topic' | 'location' | 'price' | 'space'
	sortDir: 'asc', // 'asc' | 'desc'
	get sortedLessons() {
		const arr = [...this.lessons]
		const key = this.sortBy
		arr.sort((a, b) => {
			const av = a[key]
			const bv = b[key]
			if (typeof av === 'number' && typeof bv === 'number') return av - bv
			return String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' })
		})
		return this.sortDir === 'asc' ? arr : arr.reverse()
	},
	get cartCount() {
		return this.cartItems.length
	},
})

export const cartTotal = computed(() => store.cartItems.reduce((s, it) => s + (it.price || 0), 0))
