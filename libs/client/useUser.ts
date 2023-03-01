import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr"; 


// 로그인 유저 정보를 가져오는 Hook
export default function userUser() {
  const { data, error } = useSWR("/api/users/me");  // SWR이 해당 URL에 해당하는 값 캐싱 & 업데이트
  const router = useRouter();

  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);

  return { 
    user : data?.profile, 
    isLoading : !data && !error 
  };
}