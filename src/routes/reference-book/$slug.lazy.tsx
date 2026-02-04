import { ReferenceBookPage } from "@pages/reference-book";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/reference-book/$slug")({
  component: () => <ReferenceBookPage />,
});
