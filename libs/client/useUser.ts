import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// 로그인 유저 정보를 가져오는 Hook
export default function userUser() {
  const [user, setUser] = useState();
  const router = useRouter();
  
  useEffect(() => {
    fetch("/api/users/me")
    .then(response => response.json())
    .then(data => {
      if (!data.ok) {
        return router.replace("/enter");    // push는 리다이렉트 후 뒤로가기 기록에 남음 (로그인 해야하므로 뒤로 가기 할 필요 없으니 replace)
      }
      setUser(data.profile);
    })
  }, [router]);
  
  return user;
}