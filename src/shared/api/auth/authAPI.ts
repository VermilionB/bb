import { $authHost, $host } from "..";

/**
 * Checks user authentication status with retry mechanism
 * @param retryCount - Number of retry attempts (default: 0)
 * @returns Boolean indicating authentication status
 */
export const check = async (retryCount = 0): Promise<boolean> => {
  try {
    const { status } = await $host.get<void>("authorization/user/check");
    return status === 200;
  } catch {
    // Limit retry attempts
    if (retryCount >= 3) {
      return false;
    }

    try {
      // Attempt to refresh token
      const isRefreshSuccessful = await checkRefreshToken();
      return isRefreshSuccessful ? await check(retryCount + 1) : false;
    } catch {
      return false;
    }
  }
};

/**
 * Attempts to refresh authentication token
 * @returns Boolean indicating token refresh success
 */
export const checkRefreshToken = async (): Promise<boolean> => {
  try {
    const { status } = await $authHost.get<void>(
      "/authorization/refresh-token",
    );
    return status === 200;
  } catch {
    return false;
  }
};

/**
 * Logs out the current user
 */
export const logout = async (): Promise<void> => {
  await $host.get<void>("/authorization/logout");
};

/**
 * Retrieves current user information
 * @returns User information data
 */
export const userInfo = async <T = unknown>(): Promise<T> => {
  const { data } = await $authHost.get<T>("/authorization/user/userinfo");
  return data;
};
