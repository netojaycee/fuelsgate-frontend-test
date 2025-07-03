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
  // const transporterTotal = transportCost + transporterServiceCharge;
  // const buyerTotal = transportCost + buyerServiceCharge;

  const handleDownload = async () => {
    setIsDownloading(true);
    if (!ticketRef.current) {
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
      wrapper.style.width = '100%';
      wrapper.style.padding = '24px';
      wrapper.style.paddingBottom = '48px'; // Match the pb-12
      wrapper.style.borderRadius = '20px 20px 0 0'; // Match rounded-t-[20px]
      wrapper.style.overflow = 'hidden';

      // Explicitly load the background image and ensure it's rendered properly
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = '/images/Subtract.svg';

      // Wait for the background image to load
      await new Promise<void>((resolve, reject) => {
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

        // Set a timeout just in case
        setTimeout(resolve, 1000);
      });

      // Add the cloned ticket to the wrapper
      wrapper.appendChild(ticketClone);
      container.appendChild(wrapper);

      // Wait for any images, fonts, and styles to fully apply
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use html2canvas with advanced options to capture the complete design
      const canvas = await html2canvas(wrapper, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc, element) => {
          // Fix element size and position
          element.style.width = wrapper.offsetWidth + 'px';
          element.style.height = wrapper.offsetHeight + 'px';
          element.style.position = 'static';
          element.style.transform = 'none';

          // Enhance background visibility
          const mainElement = element.querySelector('[class*="bg-\\[url"]');
          if (mainElement instanceof HTMLElement) {
            mainElement.style.backgroundImage = `url('/images/Subtract.svg')`;
            mainElement.style.backgroundPosition = 'left bottom';
            mainElement.style.backgroundSize = 'cover';
            mainElement.style.backgroundRepeat = 'no-repeat';
          }

          // Apply inline styles to preserve appearance
          const darkElements = element.querySelectorAll('.bg-dark-100');
          darkElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.backgroundColor = '#1a1a1a';
              el.style.borderRadius = '24px';
            }
          });

          const blackElements = element.querySelectorAll('.bg-black');
          blackElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.backgroundColor = '#000000';
              el.style.borderRadius = '24px';
            }
          });

          // Ensure text colors are preserved
          element.querySelectorAll('[class*="text-white"]').forEach((el) => {
            if (el instanceof HTMLElement) el.style.color = '#ffffff';
          });

          element
            .querySelectorAll('[class*="text-\\[\\#FFFFFFB8\\]"]')
            .forEach((el) => {
              if (el instanceof HTMLElement)
                el.style.color = 'rgba(255, 255, 255, 0.72)';
            });

          // Fix borders
          element
            .querySelectorAll('.border-white\\/20, [class*="border-white"]')
            .forEach((el) => {
              if (el instanceof HTMLElement)
                el.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            });

          // Fix SVG icons
          element.querySelectorAll('svg').forEach((icon) => {
            if (icon instanceof SVGElement) {
              icon.querySelectorAll('path').forEach((path) => {
                const parentColor = window.getComputedStyle(
                  icon.parentElement!,
                ).color;
                if (
                  !path.getAttribute('stroke') ||
                  path.getAttribute('stroke') === 'currentColor'
                ) {
                  path.setAttribute('stroke', parentColor);
                }
                if (
                  !path.getAttribute('fill') ||
                  path.getAttribute('fill') === 'currentColor'
                ) {
                  path.setAttribute('fill', parentColor);
                }
              });
            }
          });

          // Ensure rounded corners
          element.querySelectorAll('[class*="rounded"]').forEach((el) => {
            if (el instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(el);
              el.style.borderRadius = computedStyle.borderRadius;
            }
          });
        },
      });

      // Clean up the temporary elements
      document.body.removeChild(container);

      // Create a new PDF with the proper dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const a4Width = 210; // mm
      const a4Height = 297; // mm

      // Get canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate proper scaling to maintain aspect ratio
      const aspectRatio = canvasWidth / canvasHeight;
      let pdfWidth = a4Width - 20; // 10mm margins on each side
      let pdfHeight = pdfWidth / aspectRatio;

      // If height exceeds A4, scale down
      if (pdfHeight > a4Height - 60) {
        // Leave space for the logo
        pdfHeight = a4Height - 60;
        pdfWidth = pdfHeight * aspectRatio;
      }

      // Center the content horizontally
      const xOffset = (a4Width - pdfWidth) / 2;
      const yOffset = 20; // Leave space at the top for logo

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Load the logo for adding to the PDF
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/images/logo_gold.svg';

      // Wait for logo to load
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => {
          console.error('Failed to load logo image');
          resolve(); // Continue even if logo fails
        };
        setTimeout(resolve, 1000); // Timeout as backup
      });

      try {
        // Create a canvas for the logo
        const logoCanvas = document.createElement('canvas');
        logoCanvas.width = logoImg.width;
        logoCanvas.height = logoImg.height;
        const logoCtx = logoCanvas.getContext('2d');
        if (logoCtx) {
          logoCtx.drawImage(logoImg, 0, 0);

          // Add logo at the top center of the PDF
          const logoWidth = 40; // mm
          const logoHeight = 15; // mm
          const logoX = (a4Width - logoWidth) / 2;
          const logoY = 5; // 5mm from top

          // Add the logo to PDF
          pdf.addImage(
            logoCanvas.toDataURL('image/png'),
            'PNG',
            logoX,
            logoY,
            logoWidth,
            logoHeight,
          );
        }
      } catch (logoError) {
        console.error('Error adding logo:', logoError);
        // Continue without logo if there's an error
      }

      // Add the main ticket content
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);

      // Add footer text for authenticity
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        'This document was generated by Fuels Gate Resources Ltd. and is an official record.',
        a4Width / 2,
        a4Height - 10,
        { align: 'center' },
      );

      // Save the PDF
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
              Ticket Order
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
              Contract Details
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

            <div className="flex flex-wrap items-center justify-between">
              <Text variant="pxs" color="text-[#FFFFFFB8]">
                Transport Fee
              </Text>
              <Text variant="pm" color="text-white" fontFamily={sora.className}>
                ₦{formatNumber(transportCost, true)}
              </Text>
            </div>

            <div className="border-b border-dashed border-white/20 my-4" />
          </div>

          {/* Payment Information */}
          <div className="bg-dark-100 p-5 max-sm:px-3 rounded-3xl mb-2">
            <Text
              variant="pm"
              fontWeight="medium"
              color="text-white"
              classNames="mb-4"
            >
              Platform Payment Information{' '}
            </Text>

            {userRole === 'transporter' ? (
              <>
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <Text variant="pxs" color="text-[#FFFFFFB8]">
                    Platform Service Charge
                    {/* (
                    {userRole === 'transporter' ? '3%' : '4.5%'}) */}
                  </Text>
                  <Text
                    variant="ps"
                    color="text-white"
                    fontFamily={sora.className}
                  >
                    ₦
                    {formatNumber(
                      userRole === 'transporter'
                        ? transporterServiceCharge
                        : buyerServiceCharge,
                      true,
                    )}
                  </Text>
                </div>
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
