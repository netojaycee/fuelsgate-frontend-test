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
import { truckOfferSchema } from '@/validations/truckOffer.validation';
import { TruckOfferFormDto } from '@/types/truckOffer.types';
import { renderErrors } from '@/utils/renderErrors';
import useTruckOfferHook from '@/hooks/useTruckOffer.hook';
import Cookies from 'js-cookie';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import { useRouter } from 'next/navigation';
import useOrderHook from '@/hooks/useOrder.hook';

const sora = Sora({ subsets: ['latin'] });
const MAKE_A_TRUCK_OFFER = 'make-a-truck-offer';

const MakeATruckOfferModal = () => {
  const { openModal, handleClose } = useContext(ModalContext);
  const { useCreateNewTruckOffer, useSendNewTruckMessage } = useTruckOfferHook();
  const { mutateAsync: createNewTruckOffer, isPending: isLoadingCreateNewTruckOffer } =
    useCreateNewTruckOffer();
  const { mutateAsync: sendMessage, isPending: isLoadingSendMessage } =
    useSendNewTruckMessage();
    const router = useRouter();
      const { useUpdateOrder } = useOrderHook();


     const { mutateAsync: updateOrder, isPending: isUpdatingOrder } =
       useUpdateOrder(openModal?.data?.truckOrderId as string);

  const {
    setError,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TruckOfferFormDto>({
    resolver: yupResolver(truckOfferSchema),
    defaultValues: {
      ...(openModal?.data || {}),
      // quantity: Cookies.get('quantity'),
    },
  });


console.log(openModal?.data, 'openModal data in MakeATruckOfferModal');

  const onSubmit = async (data: any) => {
    try {

      const { price, truckOffer, truckOrderId, ...rest } = data;
      const payload = { ...rest, offerPrice: truckOffer, orderId: truckOrderId };

       const credentials = {
         ...payload,
         description: 'rejecting_order',
         type: 'truck',
         rfqStatus: 'rejected',
       };
       console.log(credentials);
       await updateOrder(credentials);
      // const truckOffer = await createNewTruckOffer(data);
      // console.log(truckOffer, "truck offer created");
      //  await sendMessage({
      //   truckOffer: data.truckOffer,
      //   truckOfferId: truckOffer.offer._id,
      // });
    // console.log(o, "offer sent")
    // console.log(data, 'fff');
      // router.push(`/dashboard/chat/${truckOffer.offer._id}`);


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
          Transporter has set the opening price at{' '}
          <b>₦{openModal?.data?.price}</b>. you can make your offer and await
          response
        </DialogDescription>
        <CustomInput
          type="number"
          name="truckOffer"
          register={register}
          error={errors.truckOffer?.message}
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
            The offer made will be reviewed by the transporter and a notice will
            be sent to you if offer is accepted or countered.
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
            loading={
              isLoadingCreateNewTruckOffer ||
              isLoadingSendMessage ||
              isUpdatingOrder
            }
          />
        </div>
      </form>
    </>
  );
};

export { MakeATruckOfferModal, MAKE_A_TRUCK_OFFER };
