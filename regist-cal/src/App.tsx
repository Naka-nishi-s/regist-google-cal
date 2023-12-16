import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
  const SCOPE = 'https://www.googleapis.com/auth/calendar';

  const [client, setClient] = useState<any>(null);
  const [accessToken, setAccessToken] = useState('');

  console.log("アクセストークン", accessToken)

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initClient;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const initClient = () => {
    const initTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (tokenResponse: any) => {
        setAccessToken(tokenResponse.access_token);
      },
    });
    setClient(initTokenClient);
  };

  const getToken = () => {
    if (!client) {
      console.log("clientがないです。")
      return;
    }

    client.requestAccessToken();
    console.log("アクセストークン取得完了")
  };

  const revokeToken = () => {
    window.google.accounts.oauth2.revoke(accessToken, () => {
      console.log('access token revoked');
    });
  };

  const loadCalendar = () => {

    console.log("カレンダー取得開始")
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.googleapis.com/calendar/v3/calendars/primary/events`);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const events = JSON.parse(xhr.responseText).items;
        console.log("Upcoming events: ", events);
      } else {
        console.log("エラーが発生しました: ", xhr.responseText);
      }
    };
    xhr.onerror = () => {
      console.log("リクエスト中にエラーが発生しました。");
    };
    xhr.send();

    console.log("カレンダー取得完了")
  };

  return (
    <div>
      <h1>カレンダーアプリ</h1>
      <button onClick={getToken}>Get access token</button><br /><br />
      <button onClick={loadCalendar}>Load Calendar</button><br /><br />
      <button onClick={revokeToken}>Revoke token</button>
    </div>
  );
};

export default App;
