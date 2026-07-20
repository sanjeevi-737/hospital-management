import { HeartPulse } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <HeartPulse className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">MedCore HMS</h1>
          <p className="text-muted-foreground text-lg">
            Enterprise Hospital Management System for modern healthcare facilities.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-background/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-muted-foreground">Healthcare Professionals</p>
            </div>
            <div className="rounded-lg bg-background/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-primary">50K+</p>
              <p className="text-muted-foreground">Patients Managed</p>
            </div>
            <div className="rounded-lg bg-background/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-primary">99.9%</p>
              <p className="text-muted-foreground">System Uptime</p>
            </div>
            <div className="rounded-lg bg-background/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
