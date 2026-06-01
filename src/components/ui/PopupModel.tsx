import { RefreshCw, Upload, X } from "lucide-react";
import React from "react";

interface PopupModelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  buttonContent: string;
  buttonVariant?: "primary" | "danger" | "success";
  onConfirm?: () => void | Promise<void>;
  isLoading?: boolean;
}

const PopupModel = ({
  isOpen,
  onClose,
  title,
  content,
  buttonContent,
  buttonVariant = "primary",
  onConfirm,
  isLoading = false,
}: PopupModelProps) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">{content}</p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-2xl font-medium text-sm transition flex items-center justify-center gap-2
              ${buttonVariant === "danger"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : buttonVariant === "success"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-brand hover:bg-brand-dark text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              buttonContent
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModel;