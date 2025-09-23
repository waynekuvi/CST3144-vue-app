<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { store } from './store.js'

const router = useRouter()
const route = useRoute()
const cartEnabled = computed(() => store.cartCount > 0)
const isOnCart = computed(() => route.name === 'Cart')

function onCartClick(e) {
	if (!cartEnabled.value) {
		e.preventDefault()
		return
	}
	e.preventDefault()
	if (isOnCart.value) router.push({ name: 'Lessons' })
	else router.push({ name: 'Cart' })
}
</script>

<template>
	<header class="hero text-light py-4 mb-4">
		<div class="container d-flex align-items-center justify-content-between">
			<div class="d-flex align-items-center gap-2">
				<div style="width:24px;height:24px;border-radius:6px;background:var(--brand-gradient);"></div>
				<strong>After School Activities</strong>
			</div>
			<nav class="d-none d-md-flex align-items-center gap-3">
				<a class="btn btn-outline-light position-relative" :class="{ disabled: !cartEnabled }" href="#/cart" @click="onCartClick">
					<i class="fa-solid fa-cart-shopping"></i>
					<span class="badge text-bg-danger ms-2">{{ store.cartCount }}</span>
				</a>
			</nav>
		</div>
		<div class="container mt-4">
			<div class="pill mb-2">ACTIVITY MEMBERSHIP</div>
			<h1 class="display-5 fw-bold mb-2">Meet your next after-school activity</h1>
			<p class="text-secondary mb-0">Browse lessons, add to cart, and checkout securely.</p>
		</div>
	</header>
	<router-view />
</template>

<style scoped>
</style>
