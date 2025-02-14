import React, { useEffect, useRef } from "react";

interface ModalProps {
  onClose?: () => void;
  children: React.ReactNode;
  showCloseIcon?: boolean;
  canBeDismissed?: boolean;
  isOpened: boolean;
}

function Modal({ onClose, showCloseIcon = true, canBeDismissed = true, children, isOpened }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape" && !canBeDismissed) e.preventDefault();
  };

  const handleModalClose = () => {
    onClose?.();
    dialogRef.current?.close();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget && canBeDismissed) {
      handleModalClose();
    }
  };

  useEffect(() => {
    if (isOpened) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpened]);

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      className="rounded-md backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-w-lg flex-col items-center justify-center gap-3 bg-white p-8">
        {showCloseIcon && (
          <button onClick={handleModalClose} className="absolute right-6 top-5 aspect-square w-6">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                fill="#0F0F0F"
              />
            </svg>
          </button>
        )}
        {children}
      </div>
    </dialog>
  );
}

export default Modal;
