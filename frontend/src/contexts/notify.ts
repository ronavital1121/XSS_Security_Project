let timeout: NodeJS.Timeout | null = null;

export function notify(message: string, dispatch: React.Dispatch<any>) {
  dispatch({ type: 'SET_NOTIFICATION', payload: message });

  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    dispatch({ type: 'SET_NOTIFICATION', payload: '' });
    timeout = null;
  }, 3001);
}
