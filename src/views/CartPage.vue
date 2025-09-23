<script setup>
import { ref, computed } from 'vue'
import { store } from '../store.js'
import { api } from '../lib/api.js'
import { getIconForTopic } from '../lib/icons.js'

function removeFromCart(idx) {
	const [removed] = store.cartItems.splice(idx, 1)
	// return space to lessons list
	const inList = store.lessons.find((l) => l._id === removed._id)
	if (inList) inList.space += 1
}

const name = ref('')
const phone = ref('')
const submitting = ref(false)
const message = ref('')

const nameValid = computed(() => /^[A-Za-z ]+$/.test(name.value.trim()))
const phoneValid = computed(() => /^[0-9]+$/.test(phone.value.trim()))
const canCheckout = computed(() => store.cartItems.length > 0 && nameValid.value && phoneValid.value)

async function checkout() {
	if (!canCheckout.value) return
	submitting.value = true
	message.value = ''
	try {
		// Prepare order
		const lessonIds = store.cartItems.map((it) => it._id)
		await api.createOrder({ name: name.value.trim(), phone: phone.value.trim(), lessonIds, spaces: store.cartItems.length })
		// Update spaces on each unique lesson id (decrement by count in cart)
		const counts = lessonIds.reduce((m, id) => ((m[id] = (m[id] || 0) + 1), m), {})
		for (const [id, cnt] of Object.entries(counts)) {
			const lesson = store.lessons.find((l) => l._id === id)
			if (lesson) {
				await api.updateLesson(id, { space: Math.max(0, Number(lesson.space)) })
			}
		}
		store.cartItems = []
		message.value = 'Order submitted successfully.'
	} catch (e) {
		message.value = `Checkout failed: ${e.message || e}`
	} finally {
		submitting.value = false
	}
}
</script>

<template>
	<div class="container py-4">
		<div class="d-flex justify-content-between align-items-center mb-3">
			<h1 class="mb-0">Shopping Cart</h1>
			<a class="btn btn-outline-light" href="#/">Back to Lessons</a>
		</div>

		<div v-if="store.cartItems.length === 0" class="alert alert-info">Your cart is empty.</div>

		<ul class="list-group mb-3" v-else>
			<li v-for="(item, idx) in store.cartItems" :key="idx" class="list-group-item d-flex justify-content-between align-items-center">
				<div class="d-flex align-items-center gap-3">
					<i class="fa-solid" :class="getIconForTopic(item.topic)"></i>
					<div>
						<div class="fw-semibold">{{ item.topic }}</div>
						<small class="text-muted">{{ item.location }} — £{{ item.price }}</small>
					</div>
				</div>
				<button class="btn btn-sm btn-outline-danger" @click="removeFromCart(idx)">Remove</button>
			</li>
		</ul>

		<h2 class="h5">Checkout</h2>
		<div class="row g-3 mb-3">
			<div class="col-md-6">
				<label class="form-label">Name</label>
				<input class="form-control" v-model="name" placeholder="Letters only" />
				<div class="form-text" :class="{ 'text-danger': name.value && !nameValid }">Name must contain letters and spaces only.</div>
			</div>
			<div class="col-md-6">
				<label class="form-label">Phone</label>
				<input class="form-control" v-model="phone" placeholder="Numbers only" />
				<div class="form-text" :class="{ 'text-danger': phone.value && !phoneValid }">Phone must contain numbers only.</div>
			</div>
		</div>

		<button class="btn btn-success" :disabled="!canCheckout || submitting" @click="checkout">Checkout</button>
		<div class="mt-3" v-if="message" :class="message.startsWith('Order') ? 'alert alert-success' : 'alert alert-warning'">{{ message }}</div>
	</div>
</template>

<style scoped>
</style>
