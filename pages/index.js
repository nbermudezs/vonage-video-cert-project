import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const VideoCall = dynamic(() => import('../src/VideoCall'), { ssr: false });

export default function Home() {
  const { query: { room, subscribeOnly }} = useRouter();
  return (
    <>
      <Head>
        <script src="https://static.opentok.com/v2/js/opentok.min.js" />
        <script src="https://www.youtube.com/iframe_api" />
        <link href="/app.css" rel="stylesheet" type="text/css" />
      </Head>
      <VideoCall room={room} subscribeOnly={subscribeOnly} />
    </>
  );
}
