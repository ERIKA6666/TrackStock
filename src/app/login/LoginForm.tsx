"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, getUserRole } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export function LoginForm() {
  const router = useRouter()
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { data, error: loginError } = await login(email, password)
    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }
    // Obtener rol
    const role = await getUserRole()
    if (role === "admin") console.log("Admin logged in")
    else if (role === "vendedor") console.log("Vendedor logged in")
    else console.log("User logged in")

    setSuccess("¡Inicio de sesión exitoso!")
    setLoading(false)
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required/>
            </div>
          </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full">
              {loading ? "Cargando..." : "Entrar"}
            </Button>
            <Button variant="outline" className="w-full" type="button">
              Login with Google
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {`Don't have an account?`}
              <a href="#" className="text-primary hover:text-accent transition-colors font-medium">
                Sign up here
              </a>
            </p>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
    )
}