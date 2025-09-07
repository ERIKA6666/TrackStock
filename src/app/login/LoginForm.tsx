"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, signUp, resetPassword, getUserRole } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

type AuthMode = "login" | "register" | "forgot-password"

export function LoginForm() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (mode === "login") {
        const { error: loginError } = await login(email, password)
        if (loginError) throw new Error(loginError.message)

        const role = await getUserRole()
        setSuccess("¡Inicio de sesión exitoso!")
        if (role === "admin") router.push("/admin")
        else router.push("/dashboard")

      } else if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden")
        }
        const { error: signUpError } = await signUp(email, password, name)
        if (signUpError) throw new Error(signUpError.message)
        setSuccess("Cuenta creada. Verifica tu email para activar tu cuenta.")

      } else if (mode === "forgot-password") {
        const { error: resetError } = await resetPassword(email)
        if (resetError) throw new Error(resetError.message)
        setSuccess("¡Revisa tu correo para restablecer tu contraseña!")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Ocurrió un error")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-lg border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {mode === "login" ? "Iniciar Sesión" : mode === "register" ? "Crear Cuenta" : "Recuperar Contraseña"}
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {mode === "login"
            ? "Ingresa tus credenciales para continuar"
            : mode === "register"
            ? "Completa los datos para crear tu cuenta"
            : "Ingresa tu correo para recibir un enlace de recuperación"}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          {mode !== "forgot-password" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="********"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading
              ? "Cargando..."
              : mode === "login"
              ? "Entrar"
              : mode === "register"
              ? "Crear cuenta"
              : "Enviar enlace"}
          </Button>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            {mode === "login" && (
              <p>
                ¿No tienes cuenta?{" "}
                <button onClick={() => setMode("register")} type="button" className="text-primary font-medium">
                  Regístrate aquí
                </button>
              </p>
            )}
            {mode === "register" && (
              <p>
                ¿Ya tienes cuenta?{" "}
                <button onClick={() => setMode("login")} type="button" className="text-primary font-medium">
                  Inicia sesión
                </button>
              </p>
            )}
            {mode === "login" && (
              <button
                type="button"
                onClick={() => setMode("forgot-password")}
                className="text-primary font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
            {mode === "forgot-password" && (
              <p>
                ¿Ya la recordaste?{" "}
                <button onClick={() => setMode("login")} type="button" className="text-primary font-medium">
                  Volver a iniciar sesión
                </button>
              </p>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
