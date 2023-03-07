import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";


function MyApp({ Component, pageProps }: AppProps) {
  // TODO: enter 페이지를 제외한 모든 페이지에서 useUser 훅 사용하므로 여기에 추가
  // TIP : arg를 받아서 (isPrivate) useUser 훅 사용할 페이지 구분
  return (
    <SWRConfig value={{fetcher: (url: string) => fetch(url).then(response => response.json())}}>
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp; 