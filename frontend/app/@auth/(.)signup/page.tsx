"use client";

import Modal from "@/components/Modal";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupIntercept() {
  return (
    <Modal>
      <div className="mb-2 text-center ">
        <span className="font-heading font-extrabold text-2xl tracking-tighter text-white">
          Shorten.it
        </span>
      </div>
      <SignupForm />
    </Modal>
  );
}
