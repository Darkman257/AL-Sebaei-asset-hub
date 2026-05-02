import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useQuery<T>(table: string, options?: { select?: string; order?: { column: string; ascending?: boolean }; limit?: number }) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      let query = supabase.from(table).select(options?.select || '*')
      if (options?.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? false })
      }
      if (options?.limit) {
        query = query.limit(options.limit)
      }
      const { data, error } = await query
      if (error) setError(error.message)
      else setData(data as T[])
      setLoading(false)
    }
    fetch()
  }, [table])

  return { data, loading, error }
}
