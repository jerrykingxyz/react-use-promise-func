import { useState, useEffect } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import usePromiseFunc from '.'

const sleep = function (time: number) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}

test('smoking', async () => {
  const PROMISE_RESOLVE_DATA = {}
  const getData = async function () {
    return PROMISE_RESOLVE_DATA
  }
  const { result, waitForNextUpdate } = renderHook(() => {
    const [fn, ...other] = usePromiseFunc(getData, [])
    useEffect(fn, [])
    return other
  })
  expect(result.current).toEqual([true, undefined, undefined])

  await waitForNextUpdate()
  expect(result.current).toEqual([false, undefined, PROMISE_RESOLVE_DATA])
})

test('throw error', async () => {
  const PROMISE_ERROR = new Error('error')
  const getData = async () => {
    throw PROMISE_ERROR
  }

  const { result, waitForNextUpdate } = renderHook(() => {
    const [fn, ...other] = usePromiseFunc(getData, [])
    useEffect(fn, [])
    return other
  })
  expect(result.current).toEqual([true, undefined, undefined])

  await waitForNextUpdate()
  expect(result.current).toEqual([false, PROMISE_ERROR, undefined])
})

test('run promise func with params', async () => {
  const testData = 1
  const transform = (num: number) => {
    return num + 1
  }
  const promiseTrans = async (num: number) => {
    return transform(num)
  }

  const { result, waitForNextUpdate } = renderHook(() => {
    const [fn, ...other] = usePromiseFunc(promiseTrans, [])
    useEffect(() => {
      fn(testData)
    }, [])
    return other
  })
  expect(result.current).toEqual([true, undefined, undefined])

  await waitForNextUpdate()
  expect(result.current).toEqual([false, undefined, transform(testData)])
})

test('rerun before loaded test', async () => {
  let PROMISE_RESOLVE_DATA = {}
  const getData = async function () {
    await sleep(200)
    return PROMISE_RESOLVE_DATA
  }
  const { result, waitForNextUpdate } = renderHook(() => {
    const [lastRefreshTime, setLastRefreshTime] = useState(0)
    const [fn, ...other] = usePromiseFunc(getData, [])
    useEffect(fn, [lastRefreshTime])
    return { res: other, setLastRefreshTime }
  })
  expect(result.current.res).toEqual([true, undefined, undefined])
  await sleep(100)
  act(() => {
    result.current.setLastRefreshTime(new Date().valueOf())
  })

  await sleep(150)
  expect(result.current.res).toEqual([true, undefined, undefined])

  await waitForNextUpdate()
  expect(result.current.res).toEqual([false, undefined, PROMISE_RESOLVE_DATA])
})
