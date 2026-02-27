<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="nav">
    <div class="nav-brand">
      <p class="nav-kicker">Signal</p>
      <h1 class="nav-title">Pulseboard</h1>
      <p class="nav-subtitle">A tiny social demo built for fast experiments.</p>
    </div>
    <nav class="nav-links">
      <RouterLink to="/">Post</RouterLink>
      <RouterLink to="/users">Users</RouterLink>
    </nav>
  </header>
</template>
