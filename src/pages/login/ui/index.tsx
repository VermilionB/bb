"use client";

import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useLogin } from "@shared/api/mutation/auth.ts";
import Header from "@shared/components/Header/Header.tsx";
import { useAuthStore } from "@shared/store/authStore.ts";
import { usePermissionsStore } from "@shared/store/permissionStore.ts";
import { userStore } from "@shared/store/userStore.ts";
import { IconAt, IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { jwtDecode, JwtPayload } from "jwt-decode";

import styles from "./index.module.scss";

interface CustomJwtPayload extends JwtPayload {
  full_name: string;
  permissions: string[];
  preferred_username: string;
}

export const LoginPage: FC = () => {
  const colorScheme = useMantineColorScheme();
  const [backgroundState, setBackgroundState] = useState<string>("");
  const { mutate } = useLogin();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  // eslint-disable-next-line unicorn/no-null
  const [error, setError] = useState<string | null>(null);
  const { setTokens } = useAuthStore();
  const { t } = useTranslation(["login"]);
  const { setName, setB } = userStore();
  const { setPermissions } = usePermissionsStore();
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onLogin = async () => {
    setIsLoginClicked(true);
    // eslint-disable-next-line unicorn/no-null
    setError(null);
    mutate(
      { username, password },
      {
        onSuccess: (data) => {
          const {
            access_token,
            refresh_token,
            expires_in,
            refresh_expires_in,
          } = data;
          const decodedToken = jwtDecode<CustomJwtPayload>(access_token);
          const name = decodedToken.full_name;
          const permissions = decodedToken.permissions;
          const b = decodedToken.preferred_username;
          setPermissions(permissions);
          setTokens(
            access_token,
            refresh_token,
            expires_in,
            refresh_expires_in,
          );
          setName(name);
          setB(b);
          router.navigate({ to: "/", replace: true });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (loginError: any) => {
          if (loginError.response && loginError.response.data) {
            const errorMessage =
              loginError.response.data.message[0] || "Неизвестная ошибка";
            setError(errorMessage);
          } else {
            setError("Не удалось выполнить вход");
          }
        },
      },
    );
  };
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  useEffect(() => {
    const isLight = colorScheme.colorScheme === "light";
    setBackgroundState(isLight ? styles.authContainer : styles.darkContainer);
  }, [colorScheme.colorScheme]);

  if (!backgroundState) {
    return <Loader color="green" />;
  }

  return (
    <div className={backgroundState}>
      <Stack gap={0}>
        <Header isBurger={false} isProfile={false} link={false} />
        <Card
          w=""
          py={70}
          px={80}
          miw={510}
          shadow="xl"
          withBorder
          radius={0}
          style={{
            borderTop: "0",
            borderBottomRightRadius: "2px",
            borderBottomLeftRadius: "2px",
          }}
        >
          <Group
            gap="0"
            w="100%"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "0",
            }}
          >
            <Text fw={500} size="34px" className={styles.loginTitle}>
              {t("login:auth.authorization")}
            </Text>
            <TextInput
              w="350px"
              mb={"16px"}
              placeholder={t("login:auth.login-input")}
              label={t("login:auth.login")}
              error={
                isLoginClicked && !username
                  ? t("login:auth.login-required")
                  : // eslint-disable-next-line sonarjs/no-nested-conditional
                    error
                    ? "Неверные учетные данные пользователя"
                    : ""
              }
              inputWrapperOrder={["label", "input", "error"]}
              value={username}
              radius="2px"
              leftSection={<IconAt size={16} />}
              onChange={(event) => {
                setUsername(event.target.value);
                if (isLoginClicked) {
                  // eslint-disable-next-line unicorn/no-null
                  setError(null);
                }
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  onLogin();
                }
              }}
            />

            <TextInput
              w="350px"
              mb={"26px"}
              placeholder={t("login:auth.enter-password")}
              label={t("login:auth.password")}
              error={
                isLoginClicked && !password
                  ? t("login:auth.password-required")
                  : // eslint-disable-next-line sonarjs/no-nested-conditional
                    error
                    ? "Неверные учетные данные пользователя"
                    : ""
              }
              inputWrapperOrder={["label", "input", "error"]}
              radius="2px"
              type={showPassword ? "text" : "password"}
              leftSection={<IconLock size={16} />}
              rightSection={
                <div
                  onClick={() => setShowPassword((previous) => !previous)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <IconEyeOff size={16} />
                  ) : (
                    <IconEye size={16} />
                  )}
                </div>
              }
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (isLoginClicked) {
                  // eslint-disable-next-line unicorn/no-null
                  setError(null);
                }
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  onLogin();
                }
              }}
            />

            <Group w="350px" my={10}>
              <Button
                variant="filled"
                radius="xs"
                color="#006040"
                w="100%"
                size="md"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onLogin();
                  }
                }}
                onClick={onLogin}
                className={styles.loginBtn}
              >
                {t("login:auth.sign-in")}
              </Button>
            </Group>
            <Text c="dimmed" size="sm">
              © ОАО «АСБ Беларусбанк», {currentYear}
            </Text>
          </Group>
        </Card>
      </Stack>
    </div>
  );
};
