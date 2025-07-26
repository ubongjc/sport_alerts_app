import { AlertCircle, CheckCircle, X, Info } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const notificationVariants = cva(
  "notification-enter w-full max-w-sm bg-white border-l-4 rounded-lg shadow-md p-4 mb-3 pointer-events-auto flex items-start space-x-3",
  {
    variants: {
      variant: {
        default: "border-primary",
        success: "border-success",
        warning: "border-warning",
        destructive: "border-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface NotificationProps extends VariantProps<typeof notificationVariants> {
  title: string;
  message: string;
  onClose: () => void;
}

const Notification = ({ title, message, variant, onClose }: NotificationProps) => {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "destructive":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className={cn(notificationVariants({ variant }))}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Notification;
