"use client";

import Modal from "@/components/Modal";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginIntercept() {
  return (
    <Modal>
      <div className="mb-10 text-center">
        <span className="font-heading font-extrabold text-2xl tracking-tighter text-white">
          Shorten.it
        </span>
      </div>
      <LoginForm />
    </Modal>
  );
}
