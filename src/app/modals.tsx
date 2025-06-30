'use client';
import ModalRoot from '@/modals';
import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from '@/contexts/ModalContext';
import { TRUCK_RFQ, RFQModal } from '@/modals/rfq-modal';
import { LIST_TRUCK, ListTruckModal } from '@/modals/list-truck-modal';
import { TRACK_TRUCK, TrackTruckModal } from '@/modals/track-truck-modal';
import { TRUCK_RFQ_DETAILS, RFQDetailModal } from '@/modals/rfq-detail-modal';
import { MAKE_AN_OFFER, MakeAnOfferModal } from '@/modals/make-an-offer-modal';
import { ORDER_SUMMARY, OrderSummaryModal } from '@/modals/order-summary-modal';
import {
  UPLOAD_PRODUCT,
  UploadProductModal,
} from '@/modals/upload-product-modal';
import { REVIEW_ORDER, ReviewOrderModal } from '@/modals/review-order-modal';
import { LOCK_TRUCK, LockTruckModal } from '@/modals/lock-truck-modal';
import {
  CONFIRMATION_MODAL,
  ConfirmationModal,
} from '@/modals/confirmation-modal';
import ConditionsModal from '@/modals/conditional-modal';

const requiresConditions = [ORDER_SUMMARY, LOCK_TRUCK];

const AllModals = () => {
  const { openModal } = useContext(ModalContext);
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const [showConditionsModal, setShowConditionsModal] = useState(false);

  useEffect(() => {
    if (requiresConditions.includes(openModal?.name as string)) {
      setShowConditionsModal(true);
      setConditionsAccepted(false);
    } else {
      setShowConditionsModal(false);
    }
  }, [openModal]);

  const handleAcceptConditions = () => {
    setConditionsAccepted(true);
    setShowConditionsModal(false);
  };

  const renderTargetModal = () => {
    switch (openModal?.name) {
      case MAKE_AN_OFFER:
        return <MakeAnOfferModal />;
      case LOCK_TRUCK:
        return <LockTruckModal />;
      case UPLOAD_PRODUCT:
        return <UploadProductModal />;
      case ORDER_SUMMARY:
        return <OrderSummaryModal />;
      case LIST_TRUCK:
        return <ListTruckModal />;
      case TRACK_TRUCK:
        return <TrackTruckModal />;
      case TRUCK_RFQ:
        return <RFQModal />;
      case TRUCK_RFQ_DETAILS:
        return <RFQDetailModal />;
      case REVIEW_ORDER:
        return <ReviewOrderModal />;
      case CONFIRMATION_MODAL:
        return <ConfirmationModal />;
      default:
        return null;
    }
  };

  return (
    <ModalRoot>
      {showConditionsModal && !conditionsAccepted ? (
        <ConditionsModal onAccept={handleAcceptConditions} />
      ) : (
        renderTargetModal()
      )}
    </ModalRoot>
  );
};

export default AllModals;
