
import { Share2 } from "lucide-react";
import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Integrations" icon={Share2} />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Connect Your Devices</CardTitle>
          <CardDescription>Sync data from your favorite wearable devices and health apps.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This feature is coming soon! We are working hard to bring you integrations with popular platforms like Fitbit, Apple Health, and more.
          </p>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex flex-col items-center p-4 border rounded-lg bg-secondary/30" data-ai-hint="wearable technology">
              <Image src="https://picsum.photos/seed/fitbit/80/80" alt="Fitbit Logo" width={60} height={60} className="rounded-md" />
              <p className="mt-2 text-sm font-medium">Fitbit</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg bg-secondary/30" data-ai-hint="health app">
              <Image src="https://picsum.photos/seed/applehealth/80/80" alt="Apple Health Logo" width={60} height={60} className="rounded-md" />
              <p className="mt-2 text-sm font-medium">Apple Health</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg bg-secondary/30" data-ai-hint="smart watch">
              <Image src="https://picsum.photos/seed/garmin/80/80" alt="Garmin Logo" width={60} height={60} className="rounded-md" />
              <p className="mt-2 text-sm font-medium">Garmin</p>
            </div>
             <div className="flex flex-col items-center p-4 border rounded-lg bg-secondary/30" data-ai-hint="fitness tracker">
              <Image src="https://picsum.photos/seed/strava/80/80" alt="Strava Logo" width={60} height={60} className="rounded-md" />
              <p className="mt-2 text-sm font-medium">Strava</p>
            </div>
          </div>
          <p className="text-sm text-center text-primary pt-4">Stay tuned for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}
