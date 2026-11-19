import { useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from '../lib/api';

/**
 * Runs an async loader and tracks { data, error, loading }. Re-runs when `deps` change.
 * Results are ignored if the component unmounted or a newer request started.
 */
export default function useAsync(loader, deps = [], { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, error: '', loading: enabled });
  const seq = useRef(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(async () => {
    if (!enabled) return null;
    const id = ++seq.current;
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const data = await loader();
      if (id === seq.current) setState({ data, error: '', loading: false });
      return data;
    } catch (e) {
      if (id === seq.current) setState({ data: null, error: errorMessage(e), loading: false });
      return null;
    }
  }, [enabled, ...deps]);
  useEffect(() => {
    run();
    return () => { seq.current += 1; };
  }, [run]);
  return { ...state, reload: run };
}
