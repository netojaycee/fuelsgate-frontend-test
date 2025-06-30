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

const sora = Sora({ subsets: ['latin'] });

const RfqSlip: React.FC<{ truckOrder: TruckOrderDto }> = ({ truckOrder }) => {
  const ticketRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const userRole = user?.data?.role;

  // Calculate platform service charges
  const transportCost = truckOrder.price;
  const transporterServiceCharge = transportCost * 0.03; // 3% for transporter
  const buyerServiceCharge = transportCost * 0.045; // 4.5% for buyer

  // Total amounts
  const transporterTotal = transportCost + transporterServiceCharge;
  const buyerTotal = transportCost + buyerServiceCharge;

  const handleDownload = async () => {
    setIsDownloading(true);
    if (!ticketRef.current) {
      return;
    }

    try {
      // Temporarily ensure the element is visible and properly sized
      const originalDisplay = ticketRef.current.style.display;
      const originalPosition = ticketRef.current.style.position;
      const originalLeft = ticketRef.current.style.left;

      ticketRef.current.style.display = 'block';
      ticketRef.current.style.position = 'static';
      ticketRef.current.style.left = 'auto';

      // Wait for any images or fonts to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: ticketRef.current.scrollWidth,
        height: ticketRef.current.scrollHeight,
        windowWidth: ticketRef.current.scrollWidth,
        windowHeight: ticketRef.current.scrollHeight,
        x: 0,
        y: 0,
        onclone: (clonedDoc, element) => {
          // Ensure the cloned element maintains its full size
          element.style.width = ticketRef.current!.scrollWidth + 'px';
          element.style.height = ticketRef.current!.scrollHeight + 'px';
          element.style.transform = 'none';
          element.style.position = 'static';

          // Remove any overflow hidden that might crop content
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              if (el.style.overflow === 'hidden' && !el.id) {
                el.style.overflow = 'visible';
              }
            }
          });

          // Ensure background images are preserved
          const bgElements = element.querySelectorAll('[class*="bg-\\[url"]');
          bgElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              // Keep background images
              const computedStyle = window.getComputedStyle(el);
              el.style.backgroundImage = computedStyle.backgroundImage;
              el.style.backgroundSize = computedStyle.backgroundSize;
              el.style.backgroundPosition = computedStyle.backgroundPosition;
              el.style.backgroundRepeat = computedStyle.backgroundRepeat;
            }
          });

          // Preserve all background colors and patterns
          const darkElements = element.querySelectorAll('.bg-dark-100');
          darkElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.backgroundColor = '#1a1a1a'; // Keep dark background
            }
          });

          // Preserve black wrapper background
          const blackElements = element.querySelectorAll('.bg-black');
          blackElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.backgroundColor = '#000000'; // Keep black background
            }
          });

          // Ensure text colors are preserved
          const whiteTextElements = element.querySelectorAll(
            '[class*="text-white"]',
          );
          whiteTextElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.color = '#ffffff';
            }
          });

          const greyTextElements = element.querySelectorAll(
            '[class*="text-\\[\\#FFFFFFB8\\]"]',
          );
          greyTextElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.color = '#FFFFFFB8';
            }
          });

          // Preserve border styles
          const borderElements = element.querySelectorAll(
            '.border-white\\/20, [class*="border-white"]',
          );
          borderElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
          });

          // Ensure icons maintain their colors
          const icons = element.querySelectorAll('svg');
          icons.forEach((icon) => {
            if (icon instanceof SVGElement) {
              // Keep original icon colors instead of forcing black
              const paths = icon.querySelectorAll('path');
              paths.forEach((path) => {
                // Only set stroke and fill if they don't already have values
                if (
                  !path.getAttribute('stroke') ||
                  path.getAttribute('stroke') === 'currentColor'
                ) {
                  const parentColor = window.getComputedStyle(
                    icon.parentElement!,
                  ).color;
                  path.setAttribute('stroke', parentColor);
                }
                if (
                  !path.getAttribute('fill') ||
                  path.getAttribute('fill') === 'currentColor'
                ) {
                  const parentColor = window.getComputedStyle(
                    icon.parentElement!,
                  ).color;
                  path.setAttribute('fill', parentColor);
                }
              });
            }
          });

          // Ensure rounded corners are preserved
          const roundedElements =
            element.querySelectorAll('[class*="rounded"]');
          roundedElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(el);
              el.style.borderRadius = computedStyle.borderRadius;
            }
          });
        },
      });

      // Restore original styles
      ticketRef.current.style.display = originalDisplay;
      ticketRef.current.style.position = originalPosition;
      ticketRef.current.style.left = originalLeft;

      // Calculate PDF dimensions to fit the content properly
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Use A4 dimensions but adjust for content
      const a4Width = 210; // mm
      const a4Height = 297; // mm

      // Calculate scaling to fit content within A4 while maintaining aspect ratio
      const aspectRatio = canvasWidth / canvasHeight;
      let pdfWidth = a4Width - 20; // 10mm margin on each side
      let pdfHeight = pdfWidth / aspectRatio;

      // If height exceeds A4, scale down
      if (pdfHeight > a4Height - 20) {
        pdfHeight = a4Height - 20;
        pdfWidth = pdfHeight * aspectRatio;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Center the content
      const xOffset = (a4Width - pdfWidth) / 2;
      const yOffset = (a4Height - pdfHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
      pdf.save(`rfq-ticket-${truckOrder.trackingId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative bg-[url('/images/Subtract.svg')] bg-left-bottom w-full bg-cover bg-no-repeat rounded-t-[20px] overflow-hidden p-6 max-sm:px-3 pb-12">
      <div ref={ticketRef}>
        {/* Black wrapper around all sections */}
        <div className="bg-black p-4 rounded-3xl">
          <div className="bg-dark-100 p-5 max-sm:px-3 rounded-3xl mb-2">
            <span className="bg-blue-tone-900/10 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FGTruckFill color="#375DFB" height={32} width={32} />
            </span>
            <Text
              variant="pm"
              classNames="text-center uppercase mb-3"
              fontWeight="medium"
              color="text-white"
            >
              Transport RFQ
            </Text>
            <Heading
              variant="h5"
              fontWeight="regular"
              classNames="text-center uppercase"
              color="text-white"
            >
              {
                ((truckOrder.truckId as TruckDto)?.productId as ProductDto)
                  ?.value
              }
            </Heading>
          </div>

          <div className="bg-dark-100 p-5 max-sm:px-3 rounded-3xl mb-2">
            <Text
              variant="pm"
              fontWeight="medium"
              color="text-white"
              classNames="mb-4"
            >
              RFQ Details
            </Text>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Buyer
              </Text>
              <Text variant="pxs" color="text-white">
                {
                  ((truckOrder.buyerId as BuyerDto)?.userId as UserType)
                    ?.firstName
                }{' '}
                {
                  ((truckOrder.buyerId as BuyerDto)?.userId as UserType)
                    ?.lastName
                }
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Transporter
              </Text>
              <Text variant="pxs" color="text-white">
                {(truckOrder.profileId as TransporterDto)?.companyName}
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Product type
              </Text>
              <Text variant="pxs" color="text-white uppercase">
                {
                  ((truckOrder.truckId as TruckDto)?.productId as ProductDto)
                    ?.value
                }
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Ref Number
              </Text>
              <Text variant="pxs" color="text-white">
                {truckOrder.trackingId}
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Truck Number
              </Text>
              <Text variant="pxs" color="text-white">
                {(truckOrder.truckId as TruckDto)?.truckNumber}
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Hub
              </Text>
              <Text variant="pxs" color="text-white">
                {
                  ((truckOrder.truckId as TruckDto)?.depotHubId as DepotHubDto)
                    ?.name
                }
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Loading Depot
              </Text>
              <Text variant="pxs" color="text-white">
                {truckOrder.loadingDepot}
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Destination
              </Text>
              <Text variant="pxs" color="text-white">
                {truckOrder.destination}, {truckOrder.city}, {truckOrder.state}
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Truck Capacity
              </Text>
              <Text
                variant="pxs"
                color="text-white"
                classNames="inline-flex items-center gap-1"
              >
                <FGCheckCircle height={16} width={16} color="#41D195" />
                {formatNumber((truckOrder.truckId as TruckDto)?.capacity)} Ltrs
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Loading Date
              </Text>
              <Text variant="pxs" color="text-white">
                {truckOrder.loadingDate
                  ? formatDateDashTime(truckOrder.loadingDate.toString())
                  : 'TBD'}
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Status
              </Text>
              <Text variant="pxs" color="text-white capitalize">
                {truckOrder.status}
              </Text>
            </div>

            <div className="border-b border-dashed border-white/20 my-4" />

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Transport Cost
              </Text>
              <Text variant="ps" color="text-white" fontFamily={sora.className}>
                ₦{formatNumber(transportCost, true)}
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Platform Service Charge (
                {userRole === 'transporter' ? '3%' : '4.5%'})
              </Text>
              <Text variant="ps" color="text-white" fontFamily={sora.className}>
                ₦
                {formatNumber(
                  userRole === 'transporter'
                    ? transporterServiceCharge
                    : buyerServiceCharge,
                  true,
                )}
              </Text>
            </div>

            <div className="border-b border-dashed border-white/20 my-4" />

            <div className="flex flex-wrap items-center justify-between">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Total Amount
              </Text>
              <Text variant="pm" color="text-white" fontFamily={sora.className}>
                ₦
                {formatNumber(
                  userRole === 'transporter' ? transporterTotal : buyerTotal,
                  true,
                )}
              </Text>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-dark-100 p-5 max-sm:px-3 rounded-3xl mb-2">
            <Text
              variant="pm"
              fontWeight="medium"
              color="text-white"
              classNames="mb-4"
            >
              Payment Information
            </Text>

            {userRole === 'transporter' ? (
              <>
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <Text variant="pxs" color="text-[#FFFFFFB8]">
                    Bank Name
                  </Text>
                  <Text variant="pxs" color="text-white">
                    FIDELITY BANK PLC
                  </Text>
                </div>
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <Text variant="pxs" color="text-[#FFFFFFB8]">
                    Account Name
                  </Text>
                  <Text variant="pxs" color="text-white">
                    FUELS GATE RESOURCES LTD
                  </Text>
                </div>
                <div className="flex flex-wrap items-center justify-between">
                  <Text variant="pxs" color="text-[#FFFFFFB8]">
                    Account Number
                  </Text>
                  <Text variant="pxs" color="text-white">
                    5540001642
                  </Text>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <Text variant="pxs" color="text-[#FFFFFFB8]">
                    Bank Name
                  </Text>
                  <Text variant="pxs" color="text-white">
                    ZENITH BANK PLC
                  </Text>
                </div>
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <Text variant="pxs" color="text-[#FFFFFFB8]">
                    Account Name
                  </Text>
                  <Text variant="pxs" color="text-white">
                    FUELS GATE RESOURCES LTD
                  </Text>
                </div>
                <div className="flex flex-wrap items-center justify-between">
                  <Text variant="pxs" color="text-[#FFFFFFB8]">
                    Account Number
                  </Text>
                  <Text variant="pxs" color="text-white">
                    1013478130
                  </Text>
                </div>
              </>
            )}
          </div>
        </div>{' '}
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
