import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  // const fn = async (...args) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await cb(options, ...args);
  //     setData(response);
  //     setError(null);
  //   } catch (error) {
  //     setError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fn = async (...args) => {
    console.log("useFetch fn called");

    setLoading(true);
    setError(null);

    try {
      console.log("Calling:", cb);
      console.log("Options:", options);

      const response = await cb(options, ...args);

      console.log("Response:", response);

      setData(response);
    } catch (error) {
      console.error("useFetch Error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
