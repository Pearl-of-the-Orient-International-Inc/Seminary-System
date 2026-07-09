import { CredentialVerification } from "./credential-verification";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { token } = await params;

  return <CredentialVerification token={decodeURIComponent(token)} />;
}
