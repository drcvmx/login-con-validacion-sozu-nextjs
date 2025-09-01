"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { refreshAuth } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Limpiar datos previos antes de nuevo login
    localStorage.removeItem("userData")

    try {
      const response = await fetch("https://n8n.sozu.com/webhook/loginconvalidacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log("Respuesta del servidor:", data) // Para debug
      
      // Manejar diferentes formatos de respuesta
      let userData = null
      
      if (Array.isArray(data) && data.length > 0 && data[0].resultado_json) {
        // Formato: [{ resultado_json: { usuario: {...} } }]
        userData = data[0]
      } else if (data.resultado_json && data.resultado_json.usuario) {
        // Formato: { resultado_json: { usuario: {...} } }
        userData = data
      } else if (data.usuario) {
        // Formato: { usuario: {...} }
        userData = { resultado_json: data }
      } else {
        console.error("Formato de respuesta no reconocido:", data)
        throw new Error("El servidor devolvió un formato de datos no válido")
      }
      
      localStorage.setItem("userData", JSON.stringify(userData))
      refreshAuth() // Forzar actualización del contexto
      router.replace("/")
    } catch (err) {
      console.error("Login error:", err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("No se pudo conectar al servidor. Verifica tu conexión a internet.")
      } else {
        setError(`Error al iniciar sesión: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-teal-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">SOZU</CardTitle>
            <CardDescription className="text-slate-600">Ingresa tu email para acceder al sistema</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
