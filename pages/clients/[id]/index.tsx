import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Client {
  id: string;
  name: string;
  logo: string;
}

export default function ClientDetail() {
  const [client, setClient] = useState<Client | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${id}`);
      if (response.ok) {
        const data = await response.json();
        setClient(data);
      } else {
        console.error("Failed to fetch client");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <img
              src={client.logo}
              alt={`${client.name} logo`}
              className="w-32 h-32 rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold">{client.name}</h2>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-center space-x-4">
        <Link href={`/clients/${id}/edit`} passHref>
          <Button>Edit Client</Button>
        </Link>
        <Link href="/dashboard" passHref>
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
