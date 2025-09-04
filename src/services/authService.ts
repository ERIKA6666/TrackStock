import { supabase } from "@/lib/locks"

// Login con email/password
export async function login(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password })
}

// Logout
export async function logout() {
  return await supabase.auth.signOut()
}

// Obtener usuario con rol desde Auth y tabla
export async function getUserRole() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Obtener rol desde tabla Usuarios
  const { data, error } = await supabase
    .from("user")
    .select("role")
    .eq("id", user.id)
    .single()

  return data?.role || user.user_metadata.role
}
