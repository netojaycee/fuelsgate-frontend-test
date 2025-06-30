import CustomButton from '@/components/atoms/custom-button';
import { Download } from 'lucide-react';
import React from 'react'

type DownloadPdfBtnProps = {
  productQuality: string
}
const DownloadPdfBtn = ({ productQuality }: DownloadPdfBtnProps) => {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = productQuality;
    a.download = 'product_quality.pdf';
    a.target = '_blank';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    productQuality ? 
      <CustomButton
        variant="white"
        classNames="gap-1.5"
        label="Download pdf"
        leftIcon={<Download className="shrink-0" height={18} width={18} color="#666666" />}
        height="h-[38px]"
        border="border-mid-gray-400 border"
        color="text-dark-gray-400"
        fontSize="text-xs" 
        fontWeight="medium" 
        width="w-[128px]" 
        onClick={handleDownload}
      /> : null
  )
}

export { DownloadPdfBtn }