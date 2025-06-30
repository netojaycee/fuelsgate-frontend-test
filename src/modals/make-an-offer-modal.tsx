import React, { useContext } from 'react';
import { cn } from '@/lib/utils';
import { Sora } from 'next/font/google';
import { FGInfoFill } from '@fg-icons';
import CustomInput from '@/components/atoms/custom-input';
import CustomButton from '@/components/atoms/custom-button';
import { ModalContext } from '@/contexts/ModalContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { offerSchema } from '@/validations/offer.validation';
import { OfferFormDto } from '@/types/offer.types';
import { renderErrors } from '@/utils/renderErrors';
import useOfferHook from '@/hooks/useOffer.hook';
import Cookies from 'js-cookie';

const sora = Sora({ subsets: ['latin'] });
const MAKE_AN_OFFER = 'make-an-offer';

const MakeAnOfferModal = () => {
  const { openModal, handleClose } = useContext(ModalContext);
  const { useCreateNewOffer, useSendNewMessage } = useOfferHook();
  const { mutateAsync: createNewOffer, isPending: isLoadingCreateNewOffer } =
    useCreateNewOffer();
  const { mutateAsync: sendMessage, isPending: isLoadingSendMessage } =
    useSendNewMessage();

  const {
    setError,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<OfferFormDto>({
    resolver: yupResolver(offerSchema),
    defaultValues: {
      ...(openModal?.data || {}),
      volume: Cookies.get('volume'),
    },
  });

  const onSubmit = async (data: OfferFormDto) => {
    try {
      const offer = await createNewOffer(data);
      await sendMessage({ offer: data.offer, offerId: offer.data._id });
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle
          className={cn(
            'leading-5 text-blue-tone-200 font-semibold text-2xl',
            sora.className,
          )}
        >
          Make an offer
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogDescription className="text-dark-gray-400 text-sm mb-5">
          Seller has set the opening price at <b>₦{openModal?.data?.price}</b>.
          you can make your offer and await response
        </DialogDescription>
        <CustomInput
          type="number"
          name="offer"
          register={register}
          error={errors.offer?.message}
          label="Enter offer amount"
          prefix="₦"
          prefixPadding="pl-10"
          classNames="mb-5"
        />
        <Alert className="rounded-xl bg-blue-tone-50 border-none mb-14">
          <FGInfoFill height={15} width={15} color="#375DFB" className="mt-1" />
          <AlertTitle className="text-sm font-medium">
            Making an offer
          </AlertTitle>
          <AlertDescription className="text-sm text-dark-gray-350">
            The offer made will be reviewed by the seller and a notice will be
            sent to you if offer is accepted or countered.
          </AlertDescription>
        </Alert>
        <div className="flex items-center gap-2">
          <CustomButton
            variant="white"
            label="Close"
            onClick={handleClose}
            border="border-black border"
          />
          <CustomButton
            type="submit"
            variant="primary"
            label="Submit Offer"
            loading={isLoadingCreateNewOffer || isLoadingSendMessage}
          />
        </div>
      </form>
    </>
  );
};

export { MakeAnOfferModal, MAKE_AN_OFFER };
