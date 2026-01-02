import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-primary-foreground mb-8">
        IKIGAI CENTER
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          onClick={() => navigate("/admin/dashboard")}
          className="w-full h-12 text-lg bg-white text-primary hover:bg-white/90"
          size="lg"
        >
          Admin
        </Button>

        <Button
          onClick={() => navigate("/teacher/dashboard")}
          className="w-full h-12 text-lg bg-white/20 text-white border border-white/40 hover:bg-white/30"
          size="lg"
          variant="outline"
        >
          Teacher
        </Button>

        <Button
          onClick={() => navigate("/student/dashboard")}
          className="w-full h-12 text-lg bg-white/10 text-white border border-white/30 hover:bg-white/20"
          size="lg"
          variant="outline"
        >
          Student
        </Button>
      </div>

      <p className="text-primary-foreground/70 text-sm mt-8">
        Prototype owned by Tanoshi Vietnam
      </p>
    </div>
  );
};

export default Login;
