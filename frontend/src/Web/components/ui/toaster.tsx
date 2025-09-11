import { useToast } from "../../hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
type ToasterToastFromHook = {
  id: string;
  title?: string;
  description?: React.ReactNode; // peut être null ou string ou JSX
  action?: React.ReactNode;
};

export function Toaster() {
  const { toasts } = useToast(); // supposé retourner ToasterToastFromHook[]

  return (
    <ToastProvider>
      {toasts.map((toast: ToasterToastFromHook) => {
        const { id, title, description, action, ...props } = toast;

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

