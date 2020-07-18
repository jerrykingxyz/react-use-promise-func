import { useState } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import usePromiseFunc from '.'

test('simple smoking', async () => {
  const PROMISE_RESOLVE_DATA = {}
  const getData = async function () {
    return PROMISE_RESOLVE_DATA
  }
  const { result, waitForNextUpdate } = renderHook(() =>
    usePromiseFunc(getData)
  )
  expect(result.current).toEqual([true, undefined, undefined])

  await waitForNextUpdate()
  expect(result.current).toEqual([false, undefined, PROMISE_RESOLVE_DATA])
})

test('throw error', async () => {
  const PROMISE_ERROR = new Error('error')
  const getData = async () => {
    throw PROMISE_ERROR
  }

  const { result, waitForNextUpdate } = renderHook(() =>
    usePromiseFunc(getData)
  )
  expect(result.current).toEqual([true, undefined, undefined])
  await waitForNextUpdate()
  expect(result.current).toEqual([false, PROMISE_ERROR, undefined])
})

test('dependency change before loaded test', async () => {
  const PROMISE_RESOLVE_DATA = {}
  const getData = async function () {
    return PROMISE_RESOLVE_DATA
  }
  const { result, waitForNextUpdate } = renderHook(() => {
    const [lastRefreshTime, setLastRefreshTime] = useState(0)
    const res = usePromiseFunc(getData, [lastRefreshTime])
    return { res, setLastRefreshTime }
  })
  expect(result.current.res).toEqual([true, undefined, undefined])

  act(() => {
    result.current.setLastRefreshTime(new Date().valueOf())
  })

  expect(result.current.res).toEqual([true, undefined, undefined])
  await waitForNextUpdate()
  expect(result.current.res).toEqual([false, undefined, PROMISE_RESOLVE_DATA])
})
