import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

interface GoogleSignInButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function GoogleSignInButton({
  onClick,
  isLoading,
}: GoogleSignInButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-white text-gray-800 hover:bg-gray-100 transition-colors h-12 rounded-xl shadow-lg flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Conectando...</span>
        </>
      ) : (
        <>
          <FcGoogle className="h-5 w-5" />
          <span>Continuar con Google</span>
        </>
      )}
    </Button>
  );
}
