import { Footer } from "./Footer";
import { Header } from "./Header";
import Container from "./ui/Container";

export function Layout({
  children,
  hideHeader,
}: {
  children: React.ReactNode;
  hideHeader?: boolean;
}) {
  return (
    <div>
      {!hideHeader && <Header />}
      <Container>{children}</Container>
      <Footer />
    </div>
  );
}
