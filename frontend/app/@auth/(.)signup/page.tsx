"use client";

import Modal from "@/components/Modal";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupIntercept() {
  return (
    <Modal>
      <div className="mb-6 text-center">
        <span className="font-serif font-semibold text-2xl tracking-tight text-[#141413] dark:text-[#f5f5f2]">
          Shorten<span className="text-emerald-600 dark:text-emerald-400">.it</span>
        </span>
      </div>
      <SignupForm />
    </Modal>
  );
}
