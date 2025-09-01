// 'use client';
// import React, { useEffect, useState } from 'react';
// import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
// import { Text } from '@/components/atoms/text';
// import { cn } from '@/lib/utils';

// interface WhatsAppWidgetProps {
//   phoneNumber?: string;
//   message?: string;
//   position?: 'bottom-right' | 'bottom-left';
//   className?: string;
// }

// const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
//   phoneNumber = '+2348012345678', // Default phone number - replace with actual business number
//   message = '', // No default message as per requirements
//   position = 'bottom-right',
//   className = '',
// }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Show widget after page loads
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleWhatsAppClick = () => {
//     // Open WhatsApp with just the phone number, no prefilled message
//     const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;
//     window.open(whatsappUrl, '_blank');
//   };

//   if (!isVisible) return null;

//   return (
//     <div
//       className={cn(
//         'fixed z-50 transition-all duration-300 ease-in-out',
//         position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6',
//         className,
//       )}
//     >
//       {/* Horizontal WhatsApp button with gold color */}
//       <button
//         onClick={handleWhatsAppClick}
//         className={cn(
//           'bg-gold hover:bg-[#c9a769] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
//           'py-3 px-5 flex items-center justify-center space-x-3',
//         )}
//         aria-label="Chat with us on WhatsApp"
//       >
//         <WhatsAppIcon width={24} height={24} color="white" />
//         <Text variant="ps" color="text-white" fontWeight="medium">
//           Ask us a question
//         </Text>
//       </button>
//     </div>
//   );
// };

// export default WhatsAppWidget;


'use client';

import React, { useState, useEffect } from 'react';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

interface WhatsAppWidgetProps {
  phoneNumber: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber,
  position = 'bottom-right',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the widget after a short delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
      {/* Outer pulsing ring */}
      {/* <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-75"></div> */}

      {/* Middle ring with slower pulse */}
      <div className="absolute inset-0 rounded-full bg-gold animate-pulse opacity-50 scale-100"></div>

      {/* Rotating dial effect */}
      <div className="absolute inset-0 rounded-full border-2 border-gold/30 animate-spin-slow">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-1 h-1 bg-gold rounded-full"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 bg-gold rounded-full"></div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1 h-1 bg-gold rounded-full"></div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 w-1 h-1 bg-gold rounded-full"></div>
      </div>

      {/* Main button */}
      <button
        onClick={handleWhatsAppClick}
        className="relative bg-gold hover:bg-gold/90 text-white rounded-full p-4 shadow-lg transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gold/50 group"
        aria-label="Contact us on WhatsApp"
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative flex items-center space-x-2">
          {/* <WhatsAppIcon width={24} height={24} color="white" /> */}
          <WhatsAppIcon
            className="text-2xl animate-bounce"
            width={24}
            height={24}
            color="white"
          />
          <span className="font-medium text-sm whitespace-nowrap">
            How can I help you?
          </span>
        </div>

        {/* Tooltip arrow */}
        <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Additional decorative elements */}
      {/* <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gold rounded-full animate-ping delay-1000"></div> */}
    </div>
  );
};

export default WhatsAppWidget;