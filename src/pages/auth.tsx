import { AuthForm } from "@/components/auth/auth-form";
import { Brain } from "lucide-react";

export function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-12 w-12 rounded-lg bg-violet-500 flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-violet-500">Psy360</h1>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}