<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="relative min-h-screen overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-28 -left-20 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl"></div>
        <div class="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"></div>
      </div>

      <div class="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div class="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_65px_-35px_rgba(15,23,42,0.45)] lg:grid-cols-[1.1fr_0.9fr]">
          <aside class="relative hidden lg:flex flex-col justify-between bg-slate-900 p-10 text-slate-100">
            <div>
              <p class="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium tracking-wide text-slate-300">Delivery Operations Suite</p>
              <h1 class="mt-6 text-4xl font-semibold leading-tight">Manage deliveries with clarity and speed.</h1>
              <p class="mt-4 max-w-md text-sm leading-6 text-slate-300">
                Track shipments, coordinate delivery personnel, and keep customer operations synchronized from one company panel.
              </p>
            </div>

            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-3">
                <p class="text-lg font-semibold text-white">24/7</p>
                <p class="text-[11px] text-slate-300">Monitoring</p>
              </div>
              <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-3">
                <p class="text-lg font-semibold text-white">Live</p>
                <p class="text-[11px] text-slate-300">Tracking</p>
              </div>
              <div class="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-3">
                <p class="text-lg font-semibold text-white">Secure</p>
                <p class="text-[11px] text-slate-300">Access</p>
              </div>
            </div>
          </aside>

          <section class="p-6 sm:p-8 lg:p-10">
            <div class="mb-7 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold tracking-tight text-slate-900">DeliverFlow</p>
                  <p class="text-xs text-slate-500">Company Control Panel</p>
                </div>
              </div>
              <p class="hidden text-xs text-slate-500 sm:block">Secure login</p>
            </div>

            <div class="mb-7">
              <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
              <p class="mt-1 text-sm text-slate-500">Sign in to continue managing your delivery operations.</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
              <div>
                <label class="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Email</label>
                <input
                  v-model="email"
                  type="email"
                  required
                  autocomplete="username"
                  placeholder="name@company.com"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Password</label>
                <input
                  v-model="password"
                  type="password"
                  required
                  autocomplete="current-password"
                  placeholder="Enter your password"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <button
                type="submit"
                class="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sign In
              </button>

              <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
                {{ error }}
              </p>
            </form>

            <p class="mt-7 text-center text-xs text-slate-500">Protected access for authorized company users only.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { showLoader, hideLoader } from '../stores/loader'

const email = ref('')
const password = ref('')
const error = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleLogin = async () => {
  error.value = ''
  showLoader()
  try {
    const response = await axios.post(`${API_BASE_URL}/api/company/login`, {
      email: email.value,
      password: password.value
    })
    const { access_token, user } = response.data.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    // Redirect to dashboard or home
    window.location.href = '/'
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed.'
  } finally {
    hideLoader()
  }
}
</script>
