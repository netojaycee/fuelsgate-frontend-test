import CustomButton from '@/components/atoms/custom-button';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import {
  BuyerDto,
  TransporterDto,
} from '@/features/authentication/types/onboarding.types';
import { TruckDto } from '@/features/transporter-dashboard/types/truck.type';
import { TruckOrderDto } from '@/types/truck-order.types';
import { DepotHubDto } from '@/types/depot-hub.types';
import { ProductDto } from '@/types/product.types';
import { formatDateDashTime } from '@/utils/formatDate';
import { formatNumber } from '@/utils/formatNumber';
import { FGCheckCircle, FGTruckFill } from '@fg-icons';
import { Download } from 'lucide-react';
import { Sora } from 'next/font/google';
import React, { useContext, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UserType } from '@/types/user.types';
import { AuthContext } from '@/contexts/AuthContext';
import { useServiceFees } from '@/hooks/useServiceFees.hook';

const sora = Sora({ subsets: ['latin'] });

const RfqSlip: React.FC<{ ticketData: any }> = ({ ticketData }) => {
  const ticketRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const userRole = user?.data?.role;
  const { serviceFees, isLoading: isLoadingFees } = useServiceFees();

  const truckOrder = ticketData?.order as TruckOrderDto;

  // Calculate platform service charges
  const transportCost = ticketData?._doc?.transportFee;
  const transporterServiceCharge = ticketData?._doc?.transporterServiceFee;
  const buyerServiceCharge = ticketData?._doc?.buyerServiceFee;

  // Total amounts
  // const transporterTotal = transportCost + transporterServiceCharge;
  // const buyerTotal = transportCost + buyerServiceCharge;

  const handleDownload = async () => {
    setIsDownloading(true);
    if (!ticketRef.current) {
      setIsDownloading(false);
      return;
    }

    try {
      // Create a hidden container to manipulate before capturing
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      // Clone the ticket element
      const ticketClone = ticketRef.current.cloneNode(true) as HTMLElement;

      // Explicitly set the container dimensions to match the original
      container.style.width = ticketRef.current.offsetWidth + 'px';

      // Create a wrapper with the background image explicitly set
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      // Make PDF ticket a little wider (e.g. 20% wider than web ticket)
      const baseWidth = ticketRef.current.offsetWidth;
      const widerWidth = Math.round(baseWidth * 1.2);
      wrapper.style.width = widerWidth + 'px';
      wrapper.style.maxWidth = widerWidth + 'px';
      wrapper.style.minWidth = widerWidth + 'px';
      wrapper.style.padding = '24px';
      wrapper.style.paddingBottom = '48px'; // Match the pb-12
      wrapper.style.borderRadius = '20px 20px 0 0'; // Match rounded-t-[20px]
      wrapper.style.overflow = 'hidden';

      // Explicitly load the background image and ensure it's rendered properly
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = '/images/Subtract.svg';

      // Wait for the background image to load
      await new Promise<void>((resolve) => {
        bgImg.onload = () => {
          wrapper.style.backgroundImage = `url('${bgImg.src}')`;
          wrapper.style.backgroundPosition = 'left bottom';
          wrapper.style.backgroundSize = 'cover';
          wrapper.style.backgroundRepeat = 'no-repeat';
          resolve();
        };
        bgImg.onerror = () => {
          console.error('Failed to load background image');
          resolve(); // Continue even if image fails
        };
        setTimeout(resolve, 1000);
      });

      // Add the cloned ticket to the wrapper
      wrapper.appendChild(ticketClone);
      container.appendChild(wrapper);

      // Wait for any images, fonts, and styles to fully apply
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use html2canvas with advanced options to capture the complete design
      const canvas = await html2canvas(wrapper, {
        scale: 2, // Good quality, not too large
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      // Clean up the temporary elements
      document.body.removeChild(container);

      // Get canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Create a PDF sized exactly to the ticket (no extra whitespace)
      // Convert px to mm (1px = 0.264583 mm)
      const pdfWidth = canvasWidth * 0.264583;
      const pdfHeight = canvasHeight * 0.264583;
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'l' : 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });

      // Add the ticket image to the PDF, filling the page
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save(`rfq-ticket-${truckOrder?.trackingId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  // console.log(truckOrder, 'truckorderr');
  // console.log('Service Fees:', {
  //   transporterServiceFee: serviceFees.transporterServiceFee,
  //   traderServiceFee: serviceFees.traderServiceFee,
  //   transporterCharge: transporterServiceCharge,
  //   buyerCharge: buyerServiceCharge,
  // });
  // console.log(`truckOrder`, truckOrder);
  const ticketOwnerLabel =
    userRole === 'transporter'
      ? 'TRANSPORTER'
      : userRole === 'buyer'
      ? 'BUYER'
      : 'RFQ TICKET';
  return (
    <div className="relative bg-[url('/images/Subtract.svg')] bg-left-bottom w-full bg-cover bg-no-repeat overflow-hidden p-6 max-sm:px-3 pb-10">
      <div
        className="absolute top-3 -right-2 z-10"
        style={{ transform: 'rotate(15deg)' }}
      >
        <span
          className="inline-block min-w-[140px] max-w-[180px] px-4 py-2 bg-gold text-black font-bold text-md shadow rounded-tl-xl rounded-bl-xl border-l-4 border-yellow-600 text-center truncate"
          title={ticketOwnerLabel}
        >
          {ticketOwnerLabel}
        </span>
      </div>
      <div ref={ticketRef}>
        <div className="flex justify-center items-center bg-black p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo_gold.png"
            alt="Fuelsgate Logo"
            className="h-[60px] w-auto"
          />
        </div>
        {/* Black wrapper around all sections - More landscape-oriented layout */}
        <div className="bg-black p-4">
          <div className="flex items-center justify-between bg-dark-100 p-5 max-sm:px-3 rounded-3xl mb-2">
            <div className="flex items-center">
              <span className="h-14 w-14 rounded-full flex items-center justify-center mr-4 overflow-hidden relative border">
                {typeof (truckOrder?.truckId as TruckDto)?.productId?.color ===
                  'string' &&
                (truckOrder?.truckId as TruckDto)?.productId?.color.includes(
                  '-',
                ) ? (
                  <>
                    <div
                      className="absolute top-0 left-0 w-full h-1/2 rounded-t-full"
                      style={{
                        backgroundColor: (
                          truckOrder?.truckId as TruckDto
                        )?.productId?.color.split('-')[0],
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-full h-1/2 rounded-b-full"
                      style={{
                        backgroundColor: (
                          truckOrder?.truckId as TruckDto
                        )?.productId?.color.split('-')[1],
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FGTruckFill color="#fff" height={32} width={32} />
                    </div>
                  </>
                ) : (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: (truckOrder?.truckId as TruckDto)
                        ?.productId?.color,
                    }}
                  />
                )}
                <span className="absolute inset-0 flex items-center justify-center">
                  <FGTruckFill
                    color={
                      typeof (truckOrder?.truckId as TruckDto)?.productId
                        ?.color === 'string' &&
                      (
                        truckOrder?.truckId as TruckDto
                      )?.productId?.color.includes('-')
                        ? '#fff'
                        : '#fff'
                    }
                    height={32}
                    width={32}
                  />
                </span>
              </span>
              <div>
                <Text
                  variant="pm"
                  classNames="uppercase mb-1"
                  fontWeight="medium"
                  color="text-white"
                >
                  Ticket Order
                </Text>
                <Heading
                  variant="h5"
                  fontWeight="regular"
                  classNames="uppercase"
                  color="text-white"
                >
                  {
                    ((truckOrder?.truckId as TruckDto)?.productId as ProductDto)
                      ?.value
                  }
                </Heading>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                Reference ID
              </Text>
              <Text variant="pm" color="text-white" fontWeight="medium">
                {truckOrder?.trackingId}
              </Text>
            </div>
          </div>

          <div className="bg-dark-100 p-5 max-sm:px-3 rounded-3xl mb-2">
            <Text
              variant="pm"
              fontWeight="medium"
              color="text-white"
              classNames="mb-4"
            >
              Contract Details
            </Text>

            {/* Grid layout for contract details - more compact and landscape-oriented */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Buyer
                </Text>
                <Text variant="pxs" color="text-white">
                  {
                    ((truckOrder?.buyerId as BuyerDto)?.userId as UserType)
                      ?.firstName
                  }{' '}
                  {
                    ((truckOrder?.buyerId as BuyerDto)?.userId as UserType)
                      ?.lastName
                  }
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Transporter
                </Text>
                <Text variant="pxs" color="text-white">
                  {(truckOrder?.profileId as TransporterDto)?.companyName}
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Product Type
                </Text>
                <Text variant="pxs" color="text-white uppercase">
                  {
                    ((truckOrder?.truckId as TruckDto)?.productId as ProductDto)
                      ?.value
                  }
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Truck Number
                </Text>
                <Text variant="pxs" color="text-white">
                  {(truckOrder?.truckId as TruckDto)?.truckNumber}
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Hub
                </Text>
                <Text variant="pxs" color="text-white">
                  {
                    (
                      (truckOrder?.truckId as TruckDto)
                        ?.depotHubId as DepotHubDto
                    )?.name
                  }
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Loading Depot
                </Text>
                <Text variant="pxs" color="text-white">
                  {truckOrder?.loadingDepot}
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Destination
                </Text>
                <Text variant="pxs" color="text-white">
                  {truckOrder?.destination}, {truckOrder?.city},{' '}
                  {truckOrder?.state}
                </Text>
              </div>
              <div className="flex flex-col">
                {/* Show contact of transporter if user is buyer, or buyer if user is transporter */}
                {userRole === 'buyer' && (
                  <>
                    <Text
                      variant="pxs"
                      color="text-[#FFFFB8]"
                      classNames="mb-1"
                    >
                      Transporter Contact
                    </Text>
                    <Text variant="pxs" color="text-white">
                      {(truckOrder?.profileId as TransporterDto)?.phoneNumber ||
                        'N/A'}
                    </Text>
                  </>
                )}
                {/* {userRole === 'transporter' || userRole === 'seller' && (
                  <>
                    <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                      Buyer Contact
                    </Text>
                    <Text variant="pxs" color="text-white">
                      {((truckOrder?.buyerId as BuyerDto)?.userId as UserType)?.phoneNumber || 'N/A'}
                    </Text>
                  </>
                )} */}
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Truck Capacity
                </Text>
                <Text
                  variant="pxs"
                  color="text-white"
                  classNames="inline-flex items-center gap-1"
                >
                  <FGCheckCircle height={16} width={16} color="#41D195" />
                  {formatNumber(
                    (truckOrder?.truckId as TruckDto)?.capacity,
                  )}{' '}
                  Ltrs
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Loading Date
                </Text>
                <Text variant="pxs" color="text-white">
                  {truckOrder?.loadingDate
                    ? formatDateDashTime(truckOrder?.loadingDate.toString())
                    : 'TBD'}
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Status
                </Text>
                <Text variant="pxs" color="text-white capitalize">
                  {truckOrder?.status}
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Time
                </Text>
                <Text variant="pxs" color="text-white">
                  {truckOrder?.updatedAt
                    ? formatDateDashTime(truckOrder?.updatedAt.toString())
                    : 'TBD'}
                </Text>
              </div>
              <div className="flex flex-col">
                {/* Completed time in second column, only if completed */}
                {truckOrder?.status?.toLowerCase() === 'completed' &&
                  truckOrder?.updatedAt && (
                    <>
                      <Text
                        variant="pxs"
                        color="text-[#FFFFFFB8]"
                        classNames="mb-1"
                      >
                        Completed Time
                      </Text>
                      <Text variant="pxs" color="text-white">
                        {formatDateDashTime(truckOrder?.updatedAt.toString())}
                      </Text>
                    </>
                  )}
              </div>
            </div>

            <div className="border-b border-dashed border-white/20 my-4" />

            {/* Highlighted Transport Fee - More prominent */}
            <div className="flex flex-wrap items-center justify-between mt-6 p-3 bg-gradient-to-r from-gold/10 to-transparent rounded-xl border-l-4 border-gold">
              <Text variant="pm" fontWeight="medium" color="text-gold">
                Transport Fee
              </Text>
              <Heading
                variant="h4"
                color="text-gold"
                fontFamily={sora.className}
                fontWeight="semibold"
              >
                ₦{formatNumber(transportCost, true)}
              </Heading>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-dark-100 p-5 max-sm:px-3 rounded-3xl mb-2">
            <div className="flex justify-between items-center mb-4">
              <Text variant="pm" fontWeight="medium" color="text-white">
                Platform Payment Information
              </Text>

              {/* Platform Service Charge - Less prominent than transport fee */}
              {userRole === 'transporter' ? (
                <div className="flex flex-col items-end">
                  <Text
                    variant="pxs"
                    color="text-[#FFFFFFB8]"
                    classNames="mb-1"
                  >
                    Platform Service Charge
                  </Text>
                  <Text
                    variant="pm"
                    color="text-white"
                    fontFamily={sora.className}
                    fontWeight="medium"
                  >
                    {ticketData
                      ? `₦${formatNumber(transporterServiceCharge, true)}`
                      : 'Loading...'}
                  </Text>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <Text
                    variant="pxs"
                    color="text-[#FFFFFFB8]"
                    classNames="mb-1"
                  >
                    Platform Service Charge
                  </Text>
                  <Text
                    variant="pm"
                    color="text-white"
                    fontFamily={sora.className}
                    fontWeight="medium"
                  >
                    {ticketData
                      ? `₦${formatNumber(buyerServiceCharge, true)}`
                      : 'Loading...'}
                  </Text>
                </div>
              )}
            </div>

            <div className="border-b border-dashed border-white/20 mb-4" />

            {/* Bank details in grid layout */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {userRole === 'transporter' ? (
                <>
                  <div className="flex flex-col">
                    <Text
                      variant="pxs"
                      color="text-[#FFFFFFB8]"
                      classNames="mb-1"
                    >
                      Bank Name
                    </Text>
                    <Text variant="pxs" color="text-white">
                      FIDELITY BANK PLC
                    </Text>
                  </div>
                  <div className="flex flex-col">
                    <Text
                      variant="pxs"
                      color="text-[#FFFFFFB8]"
                      classNames="mb-1"
                    >
                      Account Name
                    </Text>
                    <Text variant="pxs" color="text-white">
                      FUELS GATE RESOURCES LTD
                    </Text>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <Text
                      variant="pxs"
                      color="text-[#FFFFFFB8]"
                      classNames="mb-1"
                    >
                      Account Number
                    </Text>
                    <Text variant="pxs" color="text-white">
                      5540001642
                    </Text>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <Text
                      variant="pxs"
                      color="text-[#FFFFFFB8]"
                      classNames="mb-1"
                    >
                      Bank Name
                    </Text>
                    <Text variant="pxs" color="text-white">
                      ZENITH BANK PLC
                    </Text>
                  </div>
                  <div className="flex flex-col">
                    <Text
                      variant="pxs"
                      color="text-[#FFFFFFB8]"
                      classNames="mb-1"
                    >
                      Account Name
                    </Text>
                    <Text variant="pxs" color="text-white">
                      FUELS GATE RESOURCES LTD
                    </Text>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <Text
                      variant="pxs"
                      color="text-[#FFFFFFB8]"
                      classNames="mb-1"
                    >
                      Account Number
                    </Text>
                    <Text variant="pxs" color="text-white">
                      1013478130
                    </Text>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Close black wrapper */}
      </div>

      <CustomButton
        variant="primary"
        bgColor="bg-gold hover:bg-[#e6bd72]"
        color="text-deep-gray-300"
        height="h-12"
        fontWeight="medium"
        label="Download RFQ Ticket"
        loading={isDownloading}
        leftIcon={<Download />}
        onClick={handleDownload}
      />
    </div>
  );
};

export default RfqSlip;
