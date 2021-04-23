# react-use-promise-func

a react hook for use promise function.

## Installation

you can install with ```npm install react-use-promise-func```

``` typescript
import usePromiseFunc from 'react-use-promise-func'
// --- or ---
const usePromiseFunc = require(react-use-promise-func').default
```

## Usage

``` typescript
import { useEffect } from 'react'
import usePromiseFunc from 'react-use-promise-func'

export default function() {
  const [fn, isLoading, error, data] = usePromiseFunc(() => {
    // fetch api
  }, [])
  
  useEffect(fn, [])
  
  return (<div>
    <p>{isLoading}</p>
    <p>{JSON.stringify(error)}</p>
    <p>{JSON.stringify(data)}</p>
  </div>)
}

```

## API

``` typescript
function usePromiseFunc<R> (
  func: () => Promise<R>,
  deps: DependencyList
): [
  () => void,
  boolean,
  any,
  R | undefined
];
```

### params

* ```func```: promise function you want to use
* ```deps```: function dependency

### return

* ```array[0]```: wrapped function
* ```array[1]```: isLoading
* ```array[2]```: promise catch error
* ```array[3]```: promise resolve data
