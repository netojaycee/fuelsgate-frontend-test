import CustomButton from '@/components/atoms/custom-button';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BuyerDto,
  SellerDto,
} from '@/features/authentication/types/onboarding.types';
import { DepotHubDto } from '@/types/depot-hub.types';
import { OrderDto } from '@/types/order.types';
import { ProductUploadDto } from '@/types/product-upload.types';
import { ProductDto } from '@/types/product.types';
import { formatDateDashTime } from '@/utils/formatDate';
import { formatNumber } from '@/utils/formatNumber';
import { FGCheckCircle, FGGoldLogo } from '@fg-icons';
import { ChevronRight, Download } from 'lucide-react';
import { Sora } from 'next/font/google';
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import FuelsgateGold from '@/components/icons/FuelsgateGold';
import { UserType } from '@/types/user.types';

const sora = Sora({ subsets: ['latin'] });

const TicketSlip: React.FC<{ order: OrderDto }> = ({ order }) => {
  const ticketRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
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
          }); // Preserve all background colors and patterns
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

          // Hide the avatar/logo section
          const logoDiv = element.querySelector('#logo');
          if (logoDiv instanceof HTMLElement) {
            logoDiv.style.display = 'none';
          }
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
      pdf.save(`ticket-${order.trackingId}.pdf`);
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
            <span className="bg-green-tone-900/10 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FGCheckCircle height={32} width={32} color="#41D195" />
            </span>
            <Text
              variant="pm"
              classNames="text-center uppercase mb-3"
              fontWeight="medium"
              color="text-white"
            >
              Ticket Order
            </Text>
            <Heading
              variant="h5"
              fontWeight="regular"
              classNames="text-center uppercase"
              color="text-white"
            >
              {
                (
                  (order.productUploadId as ProductUploadDto)
                    ?.productId as ProductDto
                )?.value
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
              Order Details
            </Text>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Buyer
              </Text>
              <Text variant="pxs" color="text-white">
                {((order.buyerId as BuyerDto)?.userId as UserType)?.firstName}{' '}
                {((order.buyerId as BuyerDto)?.userId as UserType)?.lastName}
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Product type
              </Text>
              <Text variant="pxs" color="text-white uppercase">
                {
                  (
                    (order.productUploadId as ProductUploadDto)
                      ?.productId as ProductDto
                  )?.value
                }
              </Text>
            </div>
            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Ref Number
              </Text>
              <Text variant="pxs" color="text-white">
                {order.trackingId}
              </Text>
            </div>
            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Hub
              </Text>
              <Text variant="pxs" color="text-white">
                {
                  (
                    (order.productUploadId as ProductUploadDto)
                      ?.depotHubId as DepotHubDto
                  )?.name
                }
              </Text>
            </div>
            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Depot
              </Text>
              <Text variant="pxs" color="text-white">
                {(order.productUploadId as ProductUploadDto)?.depot}
              </Text>
            </div>
            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Total Volume Ordered
              </Text>
              <Text
                variant="pxs"
                color="text-white"
                classNames="inline-flex items-center gap-1"
              >
                <FGCheckCircle height={16} width={16} color="#41D195" />
                {formatNumber(order.volume)} Ltrs
              </Text>
            </div>
            <div className="flex flex-wrap items-center justify-between mb-3">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Time
              </Text>
              <Text variant="pxs" color="text-white">
                {formatDateDashTime((order.createdAt as Date)?.toString())}
              </Text>
            </div>

            <div className="flex flex-wrap items-center justify-between">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Order Expires
              </Text>
              <Text variant="pxs" color="text-white">
                {formatDateDashTime(order.expiresIn as string)}
              </Text>
            </div>

            <div className="border-b border-dashed border-white/20 my-4" />

            <div className="flex flex-wrap items-center justify-between">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Total fee
              </Text>
              <Text variant="pm" color="text-white" fontFamily={sora.className}>
                ₦{formatNumber(order.volume * order.price, true)}
              </Text>
            </div>
          </div>

          <div
            className="bg-dark-100 p-5 max-sm:px-3 max-h-20 overflow-hidden rounded-3xl mb-5"
            id="logo"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" className="object-cover" />
                <AvatarFallback>FG</AvatarFallback>
              </Avatar>
              <div>
                <Text
                  variant="pm"
                  color="text-white"
                  fontFamily={sora.className}
                >
                  {(order.sellerId as SellerDto)?.businessName}
                </Text>
                <Text variant="pxs" color="text-[#FFFFFFB8]">
                  {(order.sellerId as SellerDto)?.depotName}
                </Text>
              </div>

              <button type="button" className="ml-auto">
                <ChevronRight color="white" />
              </button>
            </div>{' '}
            <div className="mt-4">
              <FuelsgateGold height={100} width={100} />
            </div>
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
        label="Download Ticket"
        loading={isDownloading}
        leftIcon={<Download />}
        onClick={handleDownload}
      />
    </div>
  );
};

export default TicketSlip;
