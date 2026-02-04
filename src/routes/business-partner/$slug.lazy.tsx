import { BusinessPartnerPage } from "@pages/business-partner";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/business-partner/$slug")({
  component: BusinessPartnerPage,
});
