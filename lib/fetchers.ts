// import { fetch } from "@tauri-apps/plugin-http"
// import useSWR from "swr"

// import { useSessionStore } from "@/store/session"

// export async function fetcher(url: string, options?: RequestInit) {
//   const { getAccessToken, isTokenValid } = useSessionStore.getState()
//   const token = getAccessToken()

//   if (!isTokenValid()) {
//     throw new Error("Unauthorized")
//   }

//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...options?.headers,
//       Authorization: `Bearer ${token}`,
//     },
//   })

//   return response.json()
// }

// export function useUser() {
//   const { data, isLoading, error } = useSWR(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/resource/profile/get-detail`,
//     (url) => fetcher(url)
//   )

//   return {
//     user: data,
//     isLoading,
//     isError: error,
//   }
// }
