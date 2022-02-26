import { useState, useEffect, useRef, useLayoutEffect } from "react";


const useCallbackRef = (callback) => {
  // useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component.
  const callbackRef = useRef(callback);
  // The signature is identical to useEffect, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside useLayoutEffect will be flushed synchronously, before the browser has a chance to paint.
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  return callbackRef;
};

export const useFetch = (options) => {
  const [data, setData] = useState(null);

  const savedOnSuccess = useCallbackRef(options.onSuccess);

  // Always use a dependency array to specify the dependencies, even if you have to use a blank array. If you don't, the effect will run every time the component re-renders.  
  useEffect(() => {
    console.log("useFetch useEffect ");
    if (options.url) {
      let isCancelled = false;
      fetch(options.url)
        .then((response) => response.json())
        .then((json) => {
          if (!isCancelled) {
            savedOnSuccess.current?.(json);
            setData(json);
          }
        });
      // The cleanup function is called when the component unmounts and also before the useEffect is re-run.
      // This specific use case is done to show if we have multiple API calls, and the first call is taking sometime, the subsequent API call will first cancel the previous API call, and then the subsequent API call will be made.
      // This is to ensure, that the first API call doesn't return data after the second API call is made.     
      return () => {
        isCancelled = true;
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.url]); // For primitives, it compare the value. For objects, functions and arrays it compares the reference. So ideally we should pass a primitive value as a dependency for making it predictable.

  return {
    data,
  };
};