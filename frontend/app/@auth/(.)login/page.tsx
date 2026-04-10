"use client";

import Modal from "@/components/Modal";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginIntercept() {
  return (
    <Modal>
      <LoginForm />
    </Modal>
  );
}
