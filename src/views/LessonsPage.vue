<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../lib/api.js'
import { store } from '../store.js'
import { debounce } from '../lib/utils.js'
import { getIconForTopic } from '../lib/icons.js'

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
							<i :class="getIconForTopic(lesson.topic)" class="fa-4x text-secondary"></i>
						</div>
					</template>
					<div class="position-absolute m-2 pill">FEATURED</div>
					<div class="card-body">
						<h5 class="card-title mb-2 text-light">{{ lesson.topic }}</h5>
						<div class="location-info d-flex align-items-center mb-2">
							<i class="fa-solid fa-map-marker-alt me-2 text-brand"></i>
							<span class="location-text">{{ lesson.location }}</span>
						</div>
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

/* Apple-style location display */
.location-info {
  font-size: 0.9rem;
  font-weight: 500;
}

.location-text {
  color: var(--text-body);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.text-brand {
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 0.85rem;
}

/* Enhanced card styling */
.card-title {
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.card-body {
  padding: 1.25rem 1.25rem 0.75rem 1.25rem;
}

/* Apple-style form elements */
.form-control {
  font-weight: 400;
  letter-spacing: -0.01em;
}

.form-select {
  font-weight: 500;
  letter-spacing: -0.01em;
}

.form-label {
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}
</style>
