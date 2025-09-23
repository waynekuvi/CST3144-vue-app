const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

async function request(path, options = {}) {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	})
	if (!res.ok) {
		const text = await res.text().catch(() => '')
		throw new Error(`HTTP ${res.status}: ${text}`)
	}
	const ct = res.headers.get('content-type') || ''
	return ct.includes('application/json') ? res.json() : res.text()
}

export const api = {
	getLessons() {
		return request('/lessons')
	},
	searchLessons(q) {
		const u = new URL(`${API_BASE}/search`)
		u.searchParams.set('q', q)
		return request(u.pathname + u.search)
	},
	createOrder(payload) {
		return request('/orders', { method: 'POST', body: JSON.stringify(payload) })
	},
	updateLesson(id, update) {
		return request(`/lessons/${id}`, { method: 'PUT', body: JSON.stringify(update) })
	},
}
