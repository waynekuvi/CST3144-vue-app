<script setup>
</script>

<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container">
			<a class="navbar-brand" href="#/">After School</a>
			<div>
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<a class="nav-link" href="#/">Lessons</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#/cart"><i class="fa-solid fa-cart-shopping"></i> Cart</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<router-view />
</template>

<style scoped>
</style>
