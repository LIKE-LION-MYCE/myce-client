import { EventSourcePolyfill } from 'event-source-polyfill';
import { HttpStatusCode } from 'axios';
import { reissue, setAccessTokenToStorage } from '../../auth/AuthService';

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/sse/subscribe`;
const MAX_REFRESH_COUNT = 3;

export const createSseInstance = (onMessage, onError) => {
  let token = localStorage.getItem('access_token');
  let eventSource;
  let refreshCount = 0;

  const connect = () => {

    token = localStorage.getItem('access_token');
    console.log("attempt to connect, refreshCount = ", refreshCount);

    eventSource = new EventSourcePolyfill(baseURL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      console.log(event);
      if (onMessage) onMessage(event);
    };

    eventSource.onerror = async (err) => {
      if (refreshCount >= MAX_REFRESH_COUNT) {
        return;
      }
      refreshCount++;

      if (err.status === HttpStatusCode.Unauthorized && err.data?.code === 'EXPIRED_TOKEN') {
        try {
          const reissueResult = await reissue();
          if (reissueResult.status === HttpStatusCode.Ok) {
            setAccessTokenToStorage(reissueResult);
            eventSource.close();
            connect();
            return;
          }
        } catch (e) {
          console.log('Fail to update token for SSE.');
          localStorage.removeItem('access_token');
          cookieStore.delete('refresh_token');
          if (onError) onError(e);
          eventSource.close();
          return;
        }
      }

      eventSource.close();
      setTimeout(connect, 3000);

      if (onError) onError(err);
    };
  };

  connect();

  return {
    close: () => {
      if (eventSource) {
        eventSource.close();
        console.log('SSE connection closed.');
      }
    },
  };
};