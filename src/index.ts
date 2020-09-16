import { DependencyList, useRef, useState, useCallback } from 'react'

export default function usePromiseFunc<A extends Array<any>, R>(
  func: (...args: A) => Promise<R>,
  deps: DependencyList
): [(...args: A) => void, boolean, any, R | undefined] {
  const disposeRef = useRef<null | (() => void)>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [err, setErr] = useState<any>()
  const [data, setData] = useState<R | undefined>()

  const fn = useCallback((...args: any) => {
    if (disposeRef.current) {
      disposeRef.current()
    }
    let canceled = false

    setIsLoading(true)
    Promise.resolve()
      .then(() => func(...args))
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

    disposeRef.current = () => {
      canceled = true
    }
  }, deps)

  return [fn, isLoading, err, data]
}
