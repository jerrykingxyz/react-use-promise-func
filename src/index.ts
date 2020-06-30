import { DependencyList, useState, useEffect } from 'react'

export default function usePromiseFunc<R>(
  func: () => Promise<R>,
  deps: DependencyList
): [boolean, Error, R | undefined] {
  const [isLoading, setIsLoading] = useState(false)
  const [err, setErr] = useState<any>()
  const [data, setData] = useState<R | undefined>()

  useEffect(() => {
    let canceled = false

    setIsLoading(true)
    func().then(
      res => {
        if (canceled) {
          return
        }
        setErr(undefined)
        setData(res)
        setIsLoading(false)
      },
      err => {
        if (canceled) {
          return
        }
        setErr(err)
        setData(undefined)
        setIsLoading(false)
      }
    )

    return () => {
      canceled = true
    }
  }, deps)

  return [isLoading, err, data]
}
