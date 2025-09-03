"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/locks"

type Product = {
  id_product: number
  name: string
  price: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const getProducts = async () => {
      const { data, error } = await supabase.from("Product").select("*")
      if (error) console.error(error)
      else setProducts(data)
    }
    getProducts()
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Productos</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id_product}>{p.name} - {p.price}</li>
        ))}
      </ul>
    </main>
  )
}
