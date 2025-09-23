const MAP = {
	'math': 'fa-calculator',
	'english': 'fa-book',
	'science': 'fa-flask',
	'history': 'fa-landmark',
	'geography': 'fa-globe',
	'art': 'fa-palette',
	'music': 'fa-music',
	'computer science': 'fa-laptop-code',
	'physics': 'fa-atom',
	'chemistry': 'fa-vial',
}

export function getIconForTopic(topic) {
	if (!topic) return 'fa-book'
	const key = String(topic).toLowerCase().trim()
	return MAP[key] || 'fa-book'
}
