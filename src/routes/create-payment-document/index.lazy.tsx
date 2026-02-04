import { CreatePaymentDocument } from "@pages/create-payment-document";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/create-payment-document/")({
  component: CreatePaymentDocument,
});
