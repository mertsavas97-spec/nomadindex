import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageContainer } from "@/components/layout/page-container";
import { DirectoryLoading } from "@/components/ui/directory-loading";

export default function RootLoading() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section className="border-b border-border/60 bg-linear-to-b from-primary-soft/50 to-background">
          <PageContainer className="py-12 sm:py-16">
            <div className="h-9 w-64 max-w-full animate-pulse rounded-lg bg-neutral-bg" />
            <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-neutral-bg" />
            <div className="mt-2 h-5 w-4/5 max-w-lg animate-pulse rounded bg-neutral-bg" />
          </PageContainer>
        </section>
        <PageContainer className="section-padding">
          <DirectoryLoading />
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
