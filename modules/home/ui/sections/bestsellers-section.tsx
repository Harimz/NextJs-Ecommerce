import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const BestsellersSection = () => {
  return (
    <Suspense fallback={"loading..."}>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <GeneralDisplayError
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <BestsellerSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const BestsellerSectionSuspense = () => {
  return "";
};
