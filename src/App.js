import { useState, useEffect } from "react";
import "./App.css";

import { useFetch } from "./useFetch";

const useStopwatch = () => {
  const [count, setCount] = useState(0);

  // Making changes to state is not recommended in useEffect. But if you have to, check the following:
  useEffect(() => {
    console.log("useStopwatch useEffect");
    const interval = setInterval(() => {
      console.log(`Count = ${count}`);
      // To prevent stale values of count
      // Checkout Stale Closures: https://dmitripavlutin.com/react-hooks-stale-closures/
      // In this case, the count state will be stale but the previous count value will be updated.
      setCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // If we specify count in the dependency array, the effect will run every time the count changes. And we don't want that. We want it to run only once and the setInterval to run every second.
  return count;
};

function App() {
  const [url, setUrl] = useState(null);
  const count = useStopwatch();
  // In case you have to use an object:
  // useMemo: Pass a “create” function and an array of dependencies. useMemo will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render.
  // const myOptions = useMemo(() => ({ url }), [url]); //Returns a memoized value.
  // const { data } = useFetch(myOptions);
  const { data } = useFetch({ url, onSuccess: () => console.log("success") });

  console.log("App rendering");

  return (
    <div className="App">
      <div>Hello</div>
      <div>Count: {count}</div>
      <div>{JSON.stringify(data)}</div>
      <div>
        <button onClick={() => setUrl("/jack.json")}>Jack</button>
        <button onClick={() => setUrl("/sally.json")}>Sally</button>
      </div>
    </div>
  );
}

export default App;