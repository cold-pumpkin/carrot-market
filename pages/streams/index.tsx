import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import FloatingButton from "@components/floating-button";
import { useObserver } from "@libs/client/useObserver";
import { Stream } from "@prisma/client";
import useSWR from "swr";
import { useEffect, useState } from "react";


interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
    end?: boolean;
}

const Streams: NextPage = () => {
  //const { data } = useSWR<StreamsResponse>(`/api/streams`);
  const [page, setPage] = useState(1);
  const [streams, setStreams] = useState<Stream[]>([]);
  const { data, mutate } = useSWR<StreamsResponse>(`/api/streams?page=${page}`);

  useEffect(() => {
    if (!data?.streams && !data?.streams.length) return;
    setStreams(streams.concat(data.streams));
  }, [data]);

  const onIntersect = (entry: any, observer: any) => {
    setPage((prev) => prev + 1);
  };
  const infRef = useObserver(onIntersect, 0.1);

  return (
     <Layout title="라이브" hasTabBar>
      <div className="divide-y-[1.5px] space-y-4">
        {streams.map((stream, idx) => (
          <div key={stream.id}>
            <Link className="pt-4 block px-4" href={`/streams/${stream.id}`}>
              <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </Link>
            {idx === streams.length - 1 ? (
              <div ref={!data?.end ? infRef : null} />
            ) : null}
          </div>
        ))}
        <FloatingButton href="/streams/create">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Streams;