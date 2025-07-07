'use client';
import React, { useEffect, useState } from 'react';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { Text } from '@/components/atoms/text';
import { cn } from '@/lib/utils';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = '+2348012345678', // Default phone number - replace with actual business number
  message = '', // No default message as per requirements
  position = 'bottom-right',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show widget after page loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    // Open WhatsApp with just the phone number, no prefilled message
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300 ease-in-out',
        position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6',
        className,
      )}
    >
      {/* Horizontal WhatsApp button with gold color */}
      <button
        onClick={handleWhatsAppClick}
        className={cn(
          'bg-gold hover:bg-[#c9a769] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
          'py-3 px-5 flex items-center justify-center space-x-3',
        )}
        aria-label="Chat with us on WhatsApp"
      >
        <WhatsAppIcon width={24} height={24} color="white" />
        <Text variant="ps" color="text-white" fontWeight="medium">
          Ask us a question
        </Text>
      </button>
    </div>
  );
};

export default WhatsAppWidget;
