import CustomButton from '@/components/atoms/custom-button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { CheckCheck, TriangleAlert } from 'lucide-react';
import React from 'react';

const ConditionsModal = ({ onAccept }: { onAccept: () => void }) => (
  <>
    <DialogTitle className="flex items-center gap-2">
      <TriangleAlert color="orange" />
      IMPORTANT NOTICE
      <TriangleAlert color="orange" />
    </DialogTitle>
    <DialogDescription>COMMITMENT TO OFFLINE PAYMENT TERMS</DialogDescription>
    <div className="mb-3">
      By clicking <q>Lock Volume</q> or <q>Lock Truck</q>, you acknowledge and
      agree to the following terms: <br />
      <br />
      <b>Fuelsgate Marketplace Ethics & Responsibility</b> <br />
      You will directly contact the Supplier or Transporter to finalize this
      transaction.
      <br />
      <br />
      <b>Consequences of Non-Compliance</b> <br />
      Failure to fulfill your commitment will result in:
      <br />
      <br />
      a. Immediate first-level blacklisting on the platform. <br />
      b. Suspension of account privileges.
      <br />
      <br />
      <b>Resolution Process</b> <br />
      To resolve issues and potentially lift blacklisting: <br />
      <br />
      a. Notify Fuelsgate via blacklisted@fuelsgate.com before close of
      business. <br />
      b. Provide clear reasons for non-compliance. <br />
      c. Cooperate with Fuelsgate&apos;s investigation.
      <br />
      <br />
      <b>By Proceeding, You Confirm</b> <br />
      <br />
      •⁠ ⁠Understanding of these terms and conditions. <br />
      •⁠ ⁠Commitment to ethical business practices. <br />
      •⁠ ⁠Awareness of potential consequences. <br />
      <br />
      <b>Fuelsgate reserves the right to</b> <br />
      <br />
      •⁠ ⁠Monitor and enforce compliance. <br />
      •⁠ ⁠Update terms and conditions as necessary. <br />
      <br />
      By clicking <q>Lock Volume</q> or <q>Lock Truck</q>, you affirm your
      commitment to responsible business practices and agree to abide by these
      terms.
    </div>
    <CustomButton
      onClick={onAccept}
      variant="primary"
      label="Accept"
      leftIcon={<CheckCheck />}
    />
  </>
);

export default ConditionsModal;
