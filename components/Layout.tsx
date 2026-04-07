"use server";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Page } from "./Page";
import Container from "./ui/Container";

export async function Layout({
  children,
  hideHeader,
}: {
  children: React.ReactNode;
  hideHeader?: boolean;
}) {
  return (
    <Page>
      {!hideHeader && <Header />}
      <Container>{children}</Container>
      <Footer />
    </Page>
  );
}
