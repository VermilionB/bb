import React, { useEffect } from "react";
import { useRefresh } from "@shared/api/mutation/auth.ts";
import { useAuthStore } from "@shared/store/authStore.ts";
import { useRouter } from "@tanstack/react-router";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken, refreshToken, clearTokens, setTokens, expires_in } =
    useAuthStore();
  const router = useRouter();
  const { mutate: refreshMutate } = useRefresh();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const checkTokenExpiration = () => {
      if (!accessToken) {
        router.navigate({ to: "/login", replace: true });
        return;
      }

      const tokenExpirationTime = expires_in;
      const currentTime = Date.now();

      if (currentTime >= tokenExpirationTime) {
        if (refreshToken) {
          refreshMutate(
            { token: refreshToken },
            {
              onSuccess: (data) => {
                setTokens(
                  data.access_token,
                  data.refresh_token,
                  data.expires_in,
                  data.refresh_expires_in,
                );
              },
              onError: () => {
                clearTokens();
                router.navigate({ to: "/login", replace: true });
              },
            },
          );
        } else {
          clearTokens();
          router.navigate({ to: "/login", replace: true });
        }
      }
    };

    const intervalId = setInterval(checkTokenExpiration, expires_in * 1000);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => clearInterval(intervalId);
  }, [accessToken, refreshToken, clearTokens, refreshMutate]);
  return <>{children}</>;
};

export default AuthProvider;
