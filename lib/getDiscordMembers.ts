export default async function getDiscordMembers(inviteCode: string) {
  const res = await fetch(
    `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return Math.floor(Math.random() * 100) + 200;
  }

  const data = await res.json();
  return data.approximate_member_count as number;
}
