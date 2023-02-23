import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import userSWR from "swr"; 

const fetcher = (url: string) => fetch(url).then(response => response.json());

// 로그인 유저 정보를 가져오는 Hook
export default function userUser() {
  const { data, error } = userSWR("/api/users/me", fetcher);  // SWR이 해당 URL에 해당하는 값 캐싱/업데이트
  const router = useRouter();


  return data;
}