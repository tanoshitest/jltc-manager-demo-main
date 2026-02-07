import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class DebugErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 max-w-2xl mx-auto mt-10">
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Đã xảy ra lỗi (Runtime Error)</AlertTitle>
                        <AlertDescription>
                            Ứng dụng gặp sự cố khi hiển thị thành phần này.
                        </AlertDescription>
                    </Alert>

                    <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-auto text-xs font-mono mb-4 max-h-[400px]">
                        <p className="font-bold text-red-400 mb-2">{this.state.error?.toString()}</p>
                        <pre>{this.state.errorInfo?.componentStack}</pre>
                    </div>

                    <Button onClick={() => window.location.reload()}>
                        Tải lại trang
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default DebugErrorBoundary;
