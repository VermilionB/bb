import { RPSetPaymentTransactionsDatePage } from "@pages/routine-procedures/set-payment-transactions-date/ui";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/routine-procedures/set-payment-transactions-date/",
)({
  component: RPSetPaymentTransactionsDatePage,
});
