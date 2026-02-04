import { Container, Loader, useMantineColorScheme } from "@mantine/core";

export const MainLoader = (): React.ReactElement => {
  const colorScheme = useMantineColorScheme();

  return (
    <Container
      fluid
      p={0}
      style={{
        backgroundColor:
          colorScheme.colorScheme === "light" ? "#fefefe" : "#242424",
      }}
    >
      <div style={{ position: "absolute", top: "50%", left: "50%" }}>
        <Loader type="bars" color="#006040" size="lg" />
      </div>
    </Container>
  );
};
