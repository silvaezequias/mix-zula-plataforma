import { getHost } from "@/lib/serverUtils";
import { brand } from "@/config/brand";
import { redirectToOverview } from "./_protect-flow";

type MetadataProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: MetadataProps) {
  const params = await props.params;
  const id = params.id;

  const currenthost = await getHost(true);
  const imageUrl = `${currenthost}/api/tournament/showcase/thumbnail?id=${id}`;

  return {
    openGraph: {
      title: brand.name,
      description: brand.slogan,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: brand.name,
      description: brand.slogan,
      images: [imageUrl],
    },
  };
}

export default async function TournamentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  return redirectToOverview(params.id);
}
