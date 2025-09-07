import { supabase } from "@/lib/locks"

// Login con email/password
export async function login(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password })
}

// Logout
export async function logout() {
  return await supabase.auth.signOut()
}
//Singup 
// SignUp
export async function signUp(
  email: string,
  password: string,
  name: string,
  role = "vendedor"
) {
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }, // metadatos
    },
  })

  const userId = authData.user?.id

  if (!error && authData.user) {
    await supabase.from("User").insert([
      { id: userId, name, role},
    ])
  }

  return { authData, error }
}
// Obtener usuario con rol desde Auth y tabla
export async function getUserRole() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Obtener rol desde tabla Usuarios
  const { data,  } = await supabase
    .from("user")
    .select("role")
    .eq("id", user.id)
    .single()

  return data?.role || user.user_metadata.role
}

// Reset password
export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/login", 
  })
}