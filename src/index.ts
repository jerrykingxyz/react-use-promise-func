import { DependencyList, useState, useCallback } from 'react'

export default function usePromiseFunc<R>(
  func: () => Promise<R>,
  deps: DependencyList = []
): [() => void, boolean, Error, R | undefined] {
  const [dispose, setDispose] = useState<null | (() => void)>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [err, setErr] = useState<any>()
  const [data, setData] = useState<R | undefined>()

  const fn = useCallback(() => {
    if (dispose) {
      dispose()
    }
    let canceled = false

    setIsLoading(true)
    Promise.resolve()
      .then(() => func())
      .then(
        (res) => {
          if (canceled) {
            return
          }
          setErr(undefined)
          setData(res)
          setIsLoading(false)
        },
        (err) => {
          if (canceled) {
            return
          }
          setErr(err)
          setData(undefined)
          setIsLoading(false)
        }
      )

    setDispose(() => {
      return () => {
        canceled = true
      }
    })
  }, [dispose, ...deps])

  return [fn, isLoading, err, data]
}
