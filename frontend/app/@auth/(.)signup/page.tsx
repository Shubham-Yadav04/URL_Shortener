"use client";

import Modal from "@/components/Modal";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupIntercept() {
  return (
    <Modal>
      <SignupForm />
    </Modal>
  );
}
