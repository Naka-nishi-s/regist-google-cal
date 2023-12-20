import { useEffect, useState } from 'react';
import './App.css';
import { useFetch } from './useFetch';

const App = () => {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
  const SCOPE = 'https://www.googleapis.com/auth/calendar';

  const [client, setClient] = useState<any>(null);
  const [accessToken, setAccessToken] = useState('');
  const [eventId, setEventId] = useState('');
  const { executeFetch, data, loading, error } = useFetch();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initClient;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // data ステートが更新されたときに実行される useEffect
  useEffect(() => {
    if (data) {
      console.log("data", data)

      if (data.items) {
        console.log("取得データ", data.items);
      }

      if (data.id) {
        setEventId(data.id);
      }
    }

    if (loading) {
      console.log("データ取得中...");
    }

    if (error) {
      console.error("エラー発生: ", error);
    }
  }, [data, loading, error]);

  /** 初期化 */
  const initClient = () => {
    const initTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (tokenResponse: any) => {
        console.log(tokenResponse)
        setAccessToken(tokenResponse.access_token);
      },
    });
    setClient(initTokenClient);
  };

  /** アクセストークン取得 */
  const getToken = () => {
    if (!client) {
      console.log("clientがないです。")
      return;
    }

    client.requestAccessToken();
  };

  /** アクセストークン削除 */
  const revokeToken = () => {
    window.google.accounts.oauth2.revoke(accessToken, () => {
      console.log('access token revoked');
    });
  };

  /** カレンダーの取得 */
  const loadCalendar = () => {
    executeFetch({
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      method: 'GET',
      accessToken: accessToken,
    });
  }

  /** カレンダーの登録 */
  const registerCalendar = () => {
    // 登録する内容
    const registerResource =
    {
      kind: "calendar#event",
      etag: "イータグ",
      summary: "今作ったイベント",
      description: "No Limit!",
      location: "東京",
      start: {
        dateTime: '2024-01-01T09:00:00',
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: '2024-01-01T17:00:00',
        timeZone: 'Asia/Tokyo'
      },
    }

    executeFetch({
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      method: 'POST',
      accessToken: accessToken,
      body: registerResource
    });
  }

  /** カレンダーの更新 */
  const updateCalendar = () => {

    // 登録する内容
    const registerResource =
    {
      kind: "calendar#event",
      etag: "イータグ",
      summary: "今作ったイベント",
      description: "No Way!!",
      location: "東京",
      start: {
        dateTime: '2024-01-01T09:00:00',
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: '2024-01-01T18:00:00',
        timeZone: 'Asia/Tokyo'
      },
    }

    executeFetch({
      url: `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      method: 'PUT',
      accessToken: accessToken,
      body: registerResource
    });
  };

  /** 予定の削除 */
  const deleteEvent = () => {
    fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.text();
    }).catch((error) => {
      console.log("リクエスト中にエラーが発生しました: ", error)
    })
  }

  return (
    <div>
      <h1>カレンダーアプリ</h1>
      <button onClick={getToken}>アクセストークン取得</button><br /><br />
      <button onClick={loadCalendar}>カレンダーの読み込み</button><br /><br />
      <button onClick={registerCalendar}>カレンダーの登録</button><br /><br />
      <button onClick={updateCalendar}>カレンダーの更新</button><br /><br />
      <button onClick={deleteEvent}>予定の削除</button><br /><br />
      <button onClick={revokeToken}>トークン破棄</button>
    </div>
  );
};

export default App;
