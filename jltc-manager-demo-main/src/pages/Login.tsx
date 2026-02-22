import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-light/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-dark/30 blur-[120px] rounded-full" />

      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tighter mb-2 drop-shadow-sm">
            IKIGAI CENTER
          </h1>
          <p className="text-primary-foreground/80 font-medium">Hệ thống quản lý trung tâm Nhật ngữ</p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-6 text-center">
            Vui lòng chọn vai trò
          </p>

          <div className="flex flex-col gap-4">
            <Button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full h-14 text-lg bg-white text-primary hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-white/10 font-bold rounded-2xl"
              size="lg"
            >
              Quản trị viên (Admin)
            </Button>

            <Button
              onClick={() => navigate("/teacher/classes")}
              className="w-full h-14 text-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 backdrop-blur-md rounded-2xl"
              size="lg"
              variant="outline"
            >
              Giảng viên (Teacher)
            </Button>

            <Button
              onClick={() => navigate("/student/dashboard")}
              className="w-full h-14 text-lg bg-white/5 text-white border border-white/10 hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 backdrop-blur-md rounded-2xl"
              size="lg"
              variant="outline"
            >
              Học viên (Student)
            </Button>
          </div>
        </div>

        <div className="mt-10 text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-primary-foreground/60 text-sm font-medium">
            Prototype owned by <span className="text-white">Tanoshi Vietnam</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
