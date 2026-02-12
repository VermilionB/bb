import { RPSettingsPage } from "@pages/routine-procedures/settings";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/routine-procedures/settings/")({
  component: RPSettingsPage,
});
