"use server";

import { Layout } from "@/components/Layout";
import ContactPage from "./Contact";
import { Page } from "@/components/Page";

export default async function Contact() {
  return (
    <Page>
      <Layout>
        <ContactPage />
      </Layout>
    </Page>
  );
}
