'use client';
import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
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
  message = 'Hello! I would like to make an enquiry about your fuel products and services.',
  position = 'bottom-right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show widget after page loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(
      /[^0-9]/g,
      '',
    )}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
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
      {/* Chat bubble preview */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <WhatsAppIcon width={18} height={18} color="white" />
              </div>
              <div>
                <Text variant="ps" fontWeight="semibold" color="text-gray-900">
                  Fuelsgate Support
                </Text>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Text variant="pxs" color="text-green-600">
                    Online
                  </Text>
                </div>
              </div>
            </div>
            <button
              onClick={toggleWidget}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <Text variant="pxs" color="text-gray-700">
              👋 Hi there! How can we help you today?
            </Text>
          </div>

          <div className="bg-green-50 rounded-lg p-3 mb-3">
            <Text variant="pxs" color="text-gray-700">
              We&apos;re here to assist you with:
            </Text>
            <ul className="mt-2 space-y-1">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">•</span>
                <Text variant="pxs" color="text-gray-600">
                  Product inquiries
                </Text>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">•</span>
                <Text variant="pxs" color="text-gray-600">
                  Pricing information
                </Text>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">•</span>
                <Text variant="pxs" color="text-gray-600">
                  Order support
                </Text>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">•</span>
                <Text variant="pxs" color="text-gray-600">
                  General questions
                </Text>
              </li>
            </ul>
          </div>

          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <WhatsAppIcon width={16} height={16} color="white" />
            <Text variant="ps" color="text-white" fontWeight="medium">
              Start Chat
            </Text>
          </button>
        </div>
      )}

      {/* Main widget button */}
      <button
        onClick={toggleWidget}
        className={cn(
          'relative group bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out',
          'w-14 h-14 flex items-center justify-center',
          'before:absolute before:inset-0 before:bg-green-400 before:rounded-full before:opacity-0 before:scale-0 before:transition-all before:duration-300',
          'hover:before:opacity-20 hover:before:scale-110',
          isOpen && 'bg-gray-500 hover:bg-gray-600',
        )}
        aria-label={isOpen ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
      >
        <div className="relative z-10 transition-transform duration-200">
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <WhatsAppIcon width={24} height={24} color="white" />
          )}
        </div>

        {/* Pulse animation */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat with us on WhatsApp
          <div className="absolute top-full right-2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppWidget;
