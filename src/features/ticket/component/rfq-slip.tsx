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

const RfqSlip: React.FC<{ truckOrder: TruckOrderDto }> = ({ truckOrder }) => {
  const ticketRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const userRole = user?.data?.role;
  const { serviceFees, isLoading: isLoadingFees } = useServiceFees();

  // Calculate platform service charges
  const transportCost = truckOrder.price;
  const transporterServiceCharge =
    transportCost * serviceFees.transporterServiceFee;
  const buyerServiceCharge =
    transportCost * serviceFees.traderServiceFee;

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
      wrapper.style.paddingBottom = '48px';
      wrapper.style.borderRadius = '20px 20px 0 0';
      wrapper.style.overflow = 'hidden';

      // Define color variables
      const goldColor = '#D4AF37';
      const darkColor = '#1a1a1a';
      const blackColor = '#000000';
      const whiteColor = '#ffffff';
      const whiteTransparentColor = 'rgba(255, 255, 255, 0.72)';
      const greenCheckColor = '#41D195';

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
        // Set a timeout just in case
        setTimeout(resolve, 1000);
      });

      // Add the cloned ticket to the wrapper
      wrapper.appendChild(ticketClone);
      container.appendChild(wrapper);

      // Wait for any images, fonts, and styles to fully apply
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Use html2canvas with advanced options to capture the complete design
      const canvas = await html2canvas(wrapper, {
        scale: 4, // Higher scale for better quality
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

          // Apply inline styles to preserve appearance for dark background elements
          const darkElements = element.querySelectorAll('.bg-dark-100');
          darkElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.backgroundColor = darkColor;
              el.style.borderRadius = '24px';
              el.style.padding = '20px';
            }
          });

          // Black background elements
          const blackElements = element.querySelectorAll('.bg-black');
          blackElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.backgroundColor = blackColor;
              el.style.borderRadius = '24px';
              el.style.padding = '16px';
            }
          });

          // Ensure text colors are preserved
          element.querySelectorAll('[class*="text-white"]').forEach((el) => {
            if (el instanceof HTMLElement) el.style.color = whiteColor;
          });

          // Transparent white text
          element
            .querySelectorAll('[class*="text-\\[\\#FFFFFFB8\\]"]')
            .forEach((el) => {
              if (el instanceof HTMLElement)
                el.style.color = whiteTransparentColor;
            });

          // Gold colored elements
          element.querySelectorAll('[class*="text-gold"]').forEach((el) => {
            if (el instanceof HTMLElement) el.style.color = goldColor;
          });

          // Border styles
          element
            .querySelectorAll('.border-white\\/20, [class*="border-white"]')
            .forEach((el) => {
              if (el instanceof HTMLElement)
                el.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            });

          // Border gold elements
          element.querySelectorAll('[class*="border-gold"]').forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.borderColor = goldColor;
              el.style.borderLeftWidth = '4px';
              el.style.borderStyle = 'solid';
            }
          });

          // Gold gradient backgrounds
          element.querySelectorAll('[class*="from-gold"]').forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.background = `linear-gradient(to right, rgba(212, 175, 55, 0.1), transparent)`;
              el.style.borderRadius = '12px';
              el.style.padding = '12px';
            }
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

          // Fix check icon color
          element.querySelectorAll('[color="#41D195"]').forEach((el) => {
            if (el instanceof SVGElement) {
              el.querySelectorAll('path').forEach((path) => {
                path.setAttribute('fill', greenCheckColor);
                path.setAttribute('stroke', greenCheckColor);
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

          // Fix grid layouts for PDF rendering
          element.querySelectorAll('.grid').forEach((grid) => {
            if (grid instanceof HTMLElement) {
              const columns = grid.classList.contains('grid-cols-2') ? 2 : 1;
              grid.style.display = 'grid';
              grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
              grid.style.gap = '1rem';
            }
          });

          // Preserve flex layouts
          element.querySelectorAll('.flex').forEach((flex) => {
            if (flex instanceof HTMLElement) {
              flex.style.display = 'flex';

              if (flex.classList.contains('items-center')) {
                flex.style.alignItems = 'center';
              }

              if (flex.classList.contains('justify-between')) {
                flex.style.justifyContent = 'space-between';
              }

              if (flex.classList.contains('flex-col')) {
                flex.style.flexDirection = 'column';
              }

              if (flex.classList.contains('flex-wrap')) {
                flex.style.flexWrap = 'wrap';
              }
            }
          });
        },
      });

      // Clean up the temporary elements
      document.body.removeChild(container);

      // Create a new PDF - using landscape orientation for more square appearance
      const pdf = new jsPDF('l', 'mm', [220, 200]); // Custom landscape size for more square appearance
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Get canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate proper scaling to maintain aspect ratio
      const aspectRatio = canvasWidth / canvasHeight;
      let pdfWidth = pageWidth - 20; // 10mm margins on each side
      let pdfHeight = pdfWidth / aspectRatio;

      // If height exceeds page, scale down
      if (pdfHeight > pageHeight - 30) {
        pdfHeight = pageHeight - 30;
        pdfWidth = pdfHeight * aspectRatio;
      }

      // Center the content
      const xOffset = (pageWidth - pdfWidth) / 2;
      const yOffset = 15; // Space at the top

      // Convert canvas to image data with high quality
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Load the logo for adding to the PDF - using the PNG version for better quality
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/images/logo_gold.png'; // Using PNG version for better quality

      // Wait for logo to load
      await new Promise<void>((resolve) => {
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
          const logoWidth = 50; // mm - larger size for better quality
          const logoHeight = logoWidth * (logoImg.height / logoImg.width);
          const logoX = (pageWidth - logoWidth) / 2;
          const logoY = 2; // Close to top

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
      pdf.addImage(imgData, 'PNG', xOffset, yOffset + 12, pdfWidth, pdfHeight);

      // Add footer text for authenticity
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        'This document was generated by Fuels Gate Resources Ltd. and is an official record.',
        pageWidth / 2,
        pageHeight - 2, // Changed from pageHeight - 5 to pageHeight - 2 to shift down by 3px
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
  console.log(truckOrder, 'truckorderr');
  console.log('Service Fees:', {
    transporterServiceFee: serviceFees.transporterServiceFee,
    traderServiceFee: serviceFees.traderServiceFee,
    transporterCharge: transporterServiceCharge,
    buyerCharge: buyerServiceCharge,
  });

  return (
    <div className="relative bg-[url('/images/Subtract.svg')] bg-left-bottom w-full bg-cover bg-no-repeat rounded-t-[20px] overflow-hidden p-6 max-sm:px-3 pb-12">
      <div ref={ticketRef}>
        {/* Black wrapper around all sections - More landscape-oriented layout */}
        <div className="bg-black p-4 rounded-3xl">
          <div className="flex items-center justify-between bg-dark-100 p-5 max-sm:px-3 rounded-3xl mb-2">
            <div className="flex items-center">
              <span className="bg-blue-tone-900/10 border h-14 w-14 rounded-full flex items-center justify-center mr-4">
                <FGTruckFill
                  color={
                    typeof truckOrder.truckId === 'object'
                      ? (truckOrder.truckId as TruckDto)?.productId?.color
                      : undefined
                  }
                  height={32}
                  width={32}
                />
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
                    ((truckOrder.truckId as TruckDto)?.productId as ProductDto)
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
                {truckOrder.trackingId}
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
                    ((truckOrder.buyerId as BuyerDto)?.userId as UserType)
                      ?.firstName
                  }{' '}
                  {
                    ((truckOrder.buyerId as BuyerDto)?.userId as UserType)
                      ?.lastName
                  }
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Transporter
                </Text>
                <Text variant="pxs" color="text-white">
                  {(truckOrder.profileId as TransporterDto)?.companyName}
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Product Type
                </Text>
                <Text variant="pxs" color="text-white uppercase">
                  {
                    ((truckOrder.truckId as TruckDto)?.productId as ProductDto)
                      ?.value
                  }
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Truck Number
                </Text>
                <Text variant="pxs" color="text-white">
                  {(truckOrder.truckId as TruckDto)?.truckNumber}
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Hub
                </Text>
                <Text variant="pxs" color="text-white">
                  {
                    (
                      (truckOrder.truckId as TruckDto)
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
                  {truckOrder.loadingDepot}
                </Text>
              </div>

              <div className="flex flex-col col-span-2">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Destination
                </Text>
                <Text variant="pxs" color="text-white">
                  {truckOrder.destination}, {truckOrder.city},{' '}
                  {truckOrder.state}
                </Text>
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
                    (truckOrder.truckId as TruckDto)?.capacity,
                  )}{' '}
                  Ltrs
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Loading Date
                </Text>
                <Text variant="pxs" color="text-white">
                  {truckOrder.loadingDate
                    ? formatDateDashTime(truckOrder.loadingDate.toString())
                    : 'TBD'}
                </Text>
              </div>

              <div className="flex flex-col">
                <Text variant="pxs" color="text-[#FFFFFFB8]" classNames="mb-1">
                  Status
                </Text>
                <Text variant="pxs" color="text-white capitalize">
                  {truckOrder.status}
                </Text>
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
                    {isLoadingFees
                      ? 'Loading...'
                      : `₦${formatNumber(transporterServiceCharge, true)}`}
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
                    {isLoadingFees
                      ? 'Loading...'
                      : `₦${formatNumber(buyerServiceCharge, true)}`}
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
