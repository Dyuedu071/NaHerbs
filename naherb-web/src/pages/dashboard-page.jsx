import { useAuthStore } from '../stores/auth-store'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-wider text-herb-600">Dashboard</p>
      <h1 className="mt-2 text-3xl font-bold text-herb-900">Xin chào, {user.name}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-sm text-stone-500">Email</p>
          <p className="mt-1 font-semibold">{user.email}</p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-sm text-stone-500">Vai trò</p>
          <p className="mt-1 font-semibold">{user.role}</p>
        </article>
      </div>
    </section>
  )
}
