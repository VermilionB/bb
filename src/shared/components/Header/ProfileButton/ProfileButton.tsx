"use client";

import { FC } from "react";
import { Avatar, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { userStore } from "@shared/store/userStore.ts";
import { useRouter } from "@tanstack/react-router";

import classes from "./ProfileButton.module.scss";

const ProfileButton: FC = () => {
  const router = useRouter();
  const { name, b } = userStore();

  return (
    <UnstyledButton
      className={classes.profile}
      px={10}
      onClick={() => router.navigate({ to: "/", replace: true })}
    >
      <Group>
        <Avatar color="#333333" radius="xl">
          <span style={{ fontWeight: "400" }}>
            {" "}
            {name
              .split(" ")
              .map((word) => word.slice(0, 1))
              .join("")}
          </span>{" "}
        </Avatar>
        <Stack gap={0}>
          <Text size="md" fw={400} c="white" className={classes.nickname}>
            {name}
          </Text>
          <Text size="sm" fw={400} c="white" className={classes.nickname}>
            {b}
          </Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
};

export default ProfileButton;
