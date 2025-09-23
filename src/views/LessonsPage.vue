<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../lib/api.js'
import { store } from '../store.js'
import { debounce } from '../lib/utils.js'

const loading = ref(false)
const error = ref('')
const query = ref('')

async function loadAll() {
	loading.value = true
	error.value = ''
	try {
		store.lessons = await api.getLessons()
	} catch (e) {
		error.value = String(e.message || e)
	} finally {
		loading.value = false
	}
}

const doSearch = debounce(async () => {
	const q = query.value.trim()
	if (!q) return loadAll()
	loading.value = true
	error.value = ''
	try {
		store.lessons = await api.searchLessons(q)
	} catch (e) {
		error.value = String(e.message || e)
	} finally {
		loading.value = false
	}
}, 300)

function addToCart(lesson) {
	if (lesson.space > 0) {
		store.cartItems.push({ ...lesson })
		lesson.space -= 1
	}
}

function changeSortBy(e) {
	store.sortBy = e.target.value
}

function changeSortDir(e) {
	store.sortDir = e.target.value
}

function imageSrc(lesson) {
	return lesson.image ? `${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/images/${lesson.image}` : ''
}

onMounted(loadAll)
</script>

<template>
	<div class="container py-4">
		<h2 class="h3 text-light mb-3">Lessons</h2>
		<div class="row g-2 mb-3">
			<div class="col-12">
				<div class="input-group">
					<span class="input-group-text bg-transparent text-secondary border-secondary"><i class="fa-solid fa-magnifying-glass"></i></span>
					<input class="form-control" v-model="query" @input="doSearch" placeholder="Search activity, location, price, spaces..." />
				</div>
			</div>
			<div class="col-12 d-flex gap-2 flex-wrap mt-2">
				<span v-for="c in categories" :key="c" class="pill" :class="{ 'badge-featured': c==='All' }">{{ c }}</span>
			</div>
			<div class="col-6 col-md-3">
				<label class="form-label">Sort by</label>
				<select class="form-select" :value="store.sortBy" @change="changeSortBy">
					<option value="topic">Subject</option>
					<option value="location">Location</option>
					<option value="price">Price</option>
					<option value="space">Spaces</option>
				</select>
			</div>
			<div class="col-6 col-md-3">
				<label class="form-label">Order</label>
				<select class="form-select" :value="store.sortDir" @change="changeSortDir">
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</select>
			</div>
		</div>

		<div v-if="loading" class="alert alert-info">Loading…</div>
		<div v-if="error" class="alert alert-danger">{{ error }}</div>

		<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
			<div v-for="lesson in store.sortedLessons" :key="lesson._id" class="col">
				<div class="card h-100 shadow-sm rounded-3 hover-card">
					<template v-if="lesson.image">
						<img class="card-img-top thumb" :src="imageSrc(lesson)" alt="" @error="lesson.image=''" />
					</template>
					<template v-else>
						<div class="thumb d-flex justify-content-center align-items-center bg-body-tertiary">
							<i class="fa-solid fa-book fa-2xl text-secondary"></i>
						</div>
					</template>
					<div class="position-absolute m-2 pill">FEATURED</div>
					<div class="card-body">
						<h5 class="card-title mb-1 text-light">{{ lesson.topic }}</h5>
						<div class="text-muted">{{ lesson.location }}</div>
					</div>
					<ul class="list-group list-group-flush">
						<li class="list-group-item">Price: £{{ lesson.price }}</li>
						<li class="list-group-item">Spaces: {{ lesson.space }}</li>
					</ul>
					<div class="card-footer bg-transparent">
						<button class="btn btn-brand w-100" :disabled="lesson.space <= 0" @click="addToCart(lesson)">
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.thumb { height: 220px; width: 100%; object-fit: cover; }
.hover-card { transition: transform .2s ease, box-shadow .2s ease; }
.hover-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.35); }
</style>
