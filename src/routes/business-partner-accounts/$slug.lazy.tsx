import { BusinessPartnerAccountsPage } from "@pages/business-partner-accounts";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/business-partner-accounts/$slug")({
  component: BusinessPartnerAccountsPage,
});
