// 'use client';
// import Link from 'next/link';
// import Image from 'next/image';
// import { cn } from '@/lib/utils';
// import { NavLink } from './nav-link';
// import { FGBell, FGChat, FGClipboard, FGShip } from '@fg-icons';
// import tilesBg from '@assets/images/tilesBg.svg';
// import { AuthContext } from '@/contexts/AuthContext';
// import whiteLogo from '@assets/images/logo_white.svg';
// import React, { useCallback, useContext, useEffect, useState } from 'react';
// import { Roles } from '@/features/authentication/types/authentication.types';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import { ChevronDown, Home, Menu } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { usePathname, useRouter } from 'next/navigation';
// import { CHAT, DASHBOARD, MY_ORDERS, RFQ } from '@/routes';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
// import useOrderHook from '@/hooks/useOrder.hook';
// import useOfferHook from '@/hooks/useOffer.hook';
// import Marquee from 'react-fast-marquee';
// import useBuyerDashboardHook from '../hooks/useBuyerDashboard.hook';
// import ProductRenderer from '@/components/atoms/product-renderer';
// import { formatNumber } from '@/utils/formatNumber';

// const DashboardHeader = () => {
//   const [isMounted, setIsMounted] = useState<boolean>(false);
//   const [openSheet, setOpenSheet] = useState<boolean>(false);
//   const { user, resetUser, profile } = useContext(AuthContext);
//   const router = useRouter();
//   const role: Roles | undefined = user?.data?.role;
//   const { useFetchTruckOrderAnalytics } = useTruckOrderHook();
//   const { data: truckOrderAnalytics, isLoading: truckOrderAnalyticsLoading } =
//     useFetchTruckOrderAnalytics(
//       `?${role === 'buyer' ? 'buyerId' : 'profileId'}=${
//         profile?._id
//       }&profileType=${role}`,
//     );
//   const { useFetchOrderAnalytics } = useOrderHook();
//   const { data: orderAnalytics, isLoading: orderAnalyticsLoading } =
//     useFetchOrderAnalytics(`?${role?.toLocaleLowerCase()}Id=${profile?._id}`);
//   const { useFetchOfferAnalytics } = useOfferHook();
//   const { data: offerAnalytics, isLoading: offerAnalyticsLoading } =
//     useFetchOfferAnalytics(`?profileId=${user?.data?._id}`);
//   const { buyerScrollData, loadingBuyerScrollData } = useBuyerDashboardHook();

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const handleSheetToggle = useCallback(() => {
//     setOpenSheet((prev) => !prev);
//   }, []);

//   const handleLogout = useCallback(() => {
//     resetUser && resetUser();
//     router.push('/login');
//   }, [resetUser, router]);

//   const gotoMyOrders = () => router.push(MY_ORDERS);
//   const gotoRFQ = () => router.push(RFQ);
//   const gotoChats = () => router.push(CHAT);

//   const pathname = usePathname();
// console.log(user, "Fffff", truckOrderAnalytics)
//   const MobileMenu = () => {
//     return (
//       <Sheet open={openSheet} onOpenChange={handleSheetToggle}>
//         <SheetTrigger className="md:hidden">
//           <Menu color="white" height={40} width={40} />
//         </SheetTrigger>
//         <SheetContent className="w-full px-14 py-28">
//           <SheetTitle />
//           <SheetDescription />
//           <div className="grid grid-cols-1 gap-14">
//             <Link
//               href={DASHBOARD}
//               className="flex justify-start items-center gap-2 text-lg text-gray-600"
//               onClick={handleSheetToggle}
//             >
//               <Home color="black" height={22} width={22} />
//               Dashboard
//             </Link>
//             {/* {role !== 'transporter' && ( */}
//               <Link
//                 href={CHAT}
//                 className="flex justify-start items-center gap-2 text-lg text-gray-600"
//                 onClick={handleSheetToggle}
//               >
//                 <FGChat color="black" height={24} width={24} />
//                 Chats
//               </Link>
//             {/* )} */}
//             {role === 'buyer' && (
//               <Link
//                 href={RFQ}
//                 className="flex justify-start items-center gap-2 text-lg text-gray-600"
//                 onClick={handleSheetToggle}
//               >
//                 <FGClipboard color="black" height={24} width={24} />
//                 RFQ
//               </Link>
//             )}
//             {role === 'buyer' && (
//               <Link
//                 href={MY_ORDERS}
//                 className="flex justify-start items-center gap-2 text-lg text-gray-600"
//                 onClick={handleSheetToggle}
//               >
//                 <FGShip color="black" height={24} width={24} />
//                 Orders
//               </Link>
//             )}
//             <Link
//               href="/dashboard"
//               className="flex justify-start items-center gap-2 text-lg text-gray-600"
//               onClick={handleSheetToggle}
//             >
//               <FGBell color="black" height={24} width={24} />
//               Notifications
//             </Link>
//             <DropdownMenu>
//               <DropdownMenuTrigger className="flex items-center gap-2 justify-start text-lg text-gray-600">
//                 <div className="relative h-7 w-7 rounded-full overflow-hidden border border-gray-600">
//                   <Avatar className="h-7 w-7">
//                     <AvatarImage src="" className="object-cover" />
//                     <AvatarFallback>
//                       {user?.data?.firstName.substring(0, 1)}
//                     </AvatarFallback>
//                   </Avatar>
//                 </div>
//                 {user?.data?.firstName}
//                 <ChevronDown />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem onClick={handleLogout}>
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </SheetContent>
//       </Sheet>
//     );
//   };

//   return (
//     isMounted && (
//       <>
//         <div
//           className={cn(
//             'relative bg-dark-400 pt-10 overflow-hidden max-sm:h-[800px]',
//             role === 'buyer' ? 'h-[411px] rounded-b-[30px]' : 'h-[379px]',
//           )}
//         >
//           {role === 'buyer' && (
//             <div className="absolute top-0 right-0 bottom-0 h-full w-full">
//               <Image
//                 src={tilesBg}
//                 fill
//                 alt="Tiles BG"
//                 className="object-cover"
//               />
//             </div>
//           )}

//           <div className="relative container mx-auto">
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <Link href={DASHBOARD}>
//                 <Image src={whiteLogo} width={99} height={67} alt="Logo" />
//               </Link>

//               <MobileMenu />

//               <div className="flex flex-wrap items-center gap-2 max-md:hidden">
//                 {/* {role !== 'transporter' && ( */}
//                 <NavLink
//                   icon={<FGChat color="#FEFEFE" />}
//                   frame="icon"
//                   onClick={gotoChats}
//                   label="Chats"
//                   count={offerAnalytics?.data}
//                   loading={offerAnalyticsLoading}
//                 />
//                 {/* )} */}
//                 {role === 'buyer' && (
//                   <NavLink
//                     icon={<FGClipboard color="#FEFEFE" />}
//                     frame="icon"
//                     onClick={gotoRFQ}
//                     label="RFQ"
//                     count={truckOrderAnalytics?.data}
//                     loading={truckOrderAnalyticsLoading}
//                   />
//                 )}
//                 {role === 'buyer' && (
//                   <NavLink
//                     icon={<FGShip color="#FEFEFE" />}
//                     label="Orders"
//                     frame="icon"
//                     onClick={gotoMyOrders}
//                     count={orderAnalytics?.data}
//                     loading={orderAnalyticsLoading}
//                   />
//                 )}
//                 <NavLink
//                   icon={<FGBell color="#FEFEFE" />}
//                   frame="icon"
//                   onClick={() => console.log('Hello 3')}
//                   // count={1}
//                 />
//                 <NavLink
//                   icon={
//                     <Avatar className="h-full w-full">
//                       <AvatarImage src="" className="object-cover" />
//                       <AvatarFallback className="text-black">
//                         {user?.data?.firstName.substring(0, 1)}
//                       </AvatarFallback>
//                     </Avatar>
//                   }
//                   frame="picture"
//                   label={user?.data?.firstName}
//                   dropdown
//                   dropdownOptions={[{ title: 'Logout', action: handleLogout }]}
//                 />
//               </div>
//             </div>
//           </div>

//           {role === 'buyer' &&
//             pathname === '/dashboard' &&
//             buyerScrollData &&
//             !loadingBuyerScrollData &&
//             Object.entries(buyerScrollData?.data).filter(
//               ([_, value]) => (value as any).count > 0,
//             ).length > 0 && (
//               <Marquee className="relative bg-gray-400 bg-center bg-cover h-[51px] my-10">
//                 {Object.entries(buyerScrollData?.data)
//                   .filter(([_, value]) => (value as any).count > 0)
//                   .map(([key, value]) => (
//                     <div
//                       key={key}
//                       className="flex items-center gap-2 text-white mr-10"
//                     >
//                       <ProductRenderer product={value as any} />
//                       <span>
//                         {formatNumber((value as any).count)}{' '}
//                         {(value as any).unit}
//                       </span>
//                     </div>
//                   ))}
//               </Marquee>
//             )}
//         </div>
//       </>
//     )
//   );
// };

// export default DashboardHeader;


// 'use client';
// import Link from 'next/link';
// import Image from 'next/image';
// import { cn } from '@/lib/utils';
// import { NavLink } from './nav-link';
// import { FGBell, FGChat, FGClipboard, FGShip } from '@fg-icons';
// import tilesBg from '@assets/images/tilesBg.svg';
// import { AuthContext } from '@/contexts/AuthContext';
// import whiteLogo from '@assets/images/logo_white.svg';
// import React, { useCallback, useContext, useEffect, useState } from 'react';
// import { Roles } from '@/features/authentication/types/authentication.types';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import { ChevronDown, Home, Menu } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { usePathname, useRouter } from 'next/navigation';
// import { CHAT, DASHBOARD, MY_ORDERS, RFQ } from '@/routes';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import Marquee from 'react-fast-marquee';
// import useBuyerDashboardHook from '../hooks/useBuyerDashboard.hook';
// import ProductRenderer from '@/components/atoms/product-renderer';
// import { formatNumber } from '@/utils/formatNumber';
// import { useSocket } from '@/contexts/SocketContext';
// import { SOCKET_EVENTS } from '@/lib/socketEvents';

// const DashboardHeader = () => {
//   const [isMounted, setIsMounted] = useState<boolean>(false);
//   const [openSheet, setOpenSheet] = useState<boolean>(false);
//   const [chatCount, setChatCount] = useState<number>(0);
//   const [orderCount, setOrderCount] = useState<number>(0);
//   const [rfqCount, setRfqCount] = useState<number>(0);

//   const { user, resetUser, profile } = useContext(AuthContext);
//   const { socket, notifications } = useSocket();
//   const router = useRouter();
//   const role: Roles | undefined = user?.data?.role;
//   const { buyerScrollData, loadingBuyerScrollData } = useBuyerDashboardHook();
//   const pathname = usePathname();

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Handle socket events for notification counts
//   useEffect(() => {
//     if (!socket || !user?.data?._id) return;

//     // Initialize counts from notifications
//     setChatCount(
//       Object.values(notifications).filter((n) => n.type === 'message').length,
//     );
//     setOrderCount(
//       Object.values(notifications).filter((n) => n.type === 'order').length,
//     );
//     setRfqCount(
//       Object.values(notifications).filter((n) => n.type === 'rfq').length,
//     );

//     socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (message: any) => {
//       console.log('Received message:', message);
//       if (message.userId !== user?.data?._id && message.status !== 'read') {
//         setChatCount((prev) => prev + 1);
//       }
//     });

//     socket.on(SOCKET_EVENTS.RECEIVE_ORDER, (order: any) => {
//       console.log('Received order:', order);
//       if (order.type === 'product' && role === 'buyer') {
//         setOrderCount((prev) => prev + 1);
//       } else if (order.type === 'truck' && role === 'buyer') {
//         setRfqCount((prev) => prev + 1);
//       }
//     });

//     socket.on(SOCKET_EVENTS.NOTIFICATION, (notification: any) => {
//       console.log('Received notification:', notification);
//       if (notification.type === 'message') {
//         setChatCount((prev) => prev + (notification.count || 1));
//       } else if (notification.type === 'order') {
//         setOrderCount((prev) => prev + (notification.count || 1));
//       } else if (notification.type === 'rfq') {
//         setRfqCount((prev) => prev + (notification.count || 1));
//       }
//     });

//     return () => {
//       socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
//       socket.off(SOCKET_EVENTS.RECEIVE_ORDER);
//       socket.off(SOCKET_EVENTS.NOTIFICATION);
//     };
//   }, [socket, user?.data?._id, role, notifications]);

//   const handleSheetToggle = useCallback(() => {
//     setOpenSheet((prev) => !prev);
//   }, []);

//   const handleLogout = useCallback(() => {
//     resetUser && resetUser();
//     router.push('/login');
//   }, [resetUser, router]);

//   const gotoMyOrders = () => router.push(MY_ORDERS);
//   const gotoRFQ = () => router.push(RFQ);
//   const gotoChats = () => router.push(CHAT);

//   const MobileMenu = () => {
//     return (
//       <Sheet open={openSheet} onOpenChange={handleSheetToggle}>
//         <SheetTrigger className="md:hidden">
//           <Menu color="white" height={40} width={40} />
//         </SheetTrigger>
//         <SheetContent className="w-full px-14 py-28">
//           <SheetTitle />
//           <SheetDescription />
//           <div className="grid grid-cols-1 gap-14">
//             <Link
//               href={DASHBOARD}
//               className="flex justify-start items-center gap-2 text-lg text-gray-600"
//               onClick={handleSheetToggle}
//             >
//               <Home color="black" height={22} width={22} />
//               Dashboard
//             </Link>
//             <Link
//               href={CHAT}
//               className="flex justify-start items-center gap-2 text-lg text-gray-600"
//               onClick={handleSheetToggle}
//             >
//               <FGChat color="black" height={24} width={24} />
//               Chats
//               {chatCount > 0 && (
//                 <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                   {chatCount}
//                 </span>
//               )}
//             </Link>
//               <Link
//                 href={RFQ}
//                 className="flex justify-start items-center gap-2 text-lg text-gray-600"
//                 onClick={handleSheetToggle}
//               >
//                 <FGClipboard color="black" height={24} width={24} />
//                 RFQ
//                 {rfqCount > 0 && (
//                   <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                     {rfqCount}
//                   </span>
//                 )}
//               </Link>
         
//             {role === 'buyer' || role === 'seller' && (
//               <Link
//                 href={MY_ORDERS}
//                 className="flex justify-start items-center gap-2 text-lg text-gray-600"
//                 onClick={handleSheetToggle}
//               >
//                 <FGShip color="black" height={24} width={24} />
//                 Orders
//                 {orderCount > 0 && (
//                   <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                     {orderCount}
//                   </span>
//                 )}
//               </Link>
//             )}
//             <Link
//               href="/dashboard"
//               className="flex justify-start items-center gap-2 text-lg text-gray-600"
//               onClick={handleSheetToggle}
//             >
//               <FGBell color="black" height={24} width={24} />
//               Notifications
//             </Link>
//             <DropdownMenu>
//               <DropdownMenuTrigger className="flex items-center gap-2 justify-start text-lg text-gray-600">
//                 <div className="relative h-7 w-7 rounded-full overflow-hidden border border-gray-600">
//                   <Avatar className="h-7 w-7">
//                     <AvatarImage src="" className="object-cover" />
//                     <AvatarFallback>
//                       {user?.data?.firstName.substring(0, 1)}
//                     </AvatarFallback>
//                   </Avatar>
//                 </div>
//                 {user?.data?.firstName}
//                 <ChevronDown />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem onClick={handleLogout}>
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </SheetContent>
//       </Sheet>
//     );
//   };

//   return (
//     isMounted && (
//       <>
//         <div
//           className={cn(
//             'relative bg-dark-400 pt-10 overflow-hidden max-sm:h-[800px]',
//             role === 'buyer' ? 'h-[411px] rounded-b-[30px]' : 'h-[379px]',
//           )}
//         >
//           {role === 'buyer' && (
//             <div className="absolute top-0 right-0 bottom-0 h-full w-full">
//               <Image
//                 src={tilesBg}
//                 fill
//                 alt="Tiles BG"
//                 className="object-cover"
//               />
//             </div>
//           )}

//           <div className="relative container mx-auto">
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <Link href={DASHBOARD}>
//                 <Image src={whiteLogo} width={99} height={67} alt="Logo" />
//               </Link>

//               <MobileMenu />

//               <div className="flex flex-wrap items-center gap-2 max-md:hidden">
//                 <NavLink
//                   icon={<FGChat color="#FEFEFE" />}
//                   frame="icon"
//                   onClick={gotoChats}
//                   label="Chats"
//                   count={chatCount}
//                 />
//                   <NavLink
//                     icon={<FGClipboard color="#FEFEFE" />}
//                     frame="icon"
//                     onClick={gotoRFQ}
//                     label="RFQ"
//                     count={rfqCount}
//                   />
//                 {role === 'buyer' || role === 'seller' && (
//                   <NavLink
//                     icon={<FGShip color="#FEFEFE" />}
//                     label="Orders"
//                     frame="icon"
//                     onClick={gotoMyOrders}
//                     count={orderCount}
//                   />
//                 )}
//                 <NavLink
//                   icon={<FGBell color="#FEFEFE" />}
//                   frame="icon"
//                   onClick={() => console.log('Notifications clicked')}
//                   // count={1}
//                 />
//                 <NavLink
//                   icon={
//                     <Avatar className="h-full w-full">
//                       <AvatarImage src="" className="object-cover" />
//                       <AvatarFallback className="text-black">
//                         {user?.data?.firstName.substring(0, 1)}
//                       </AvatarFallback>
//                     </Avatar>
//                   }
//                   frame="picture"
//                   label={user?.data?.firstName}
//                   dropdown
//                   dropdownOptions={[{ title: 'Logout', action: handleLogout }]}
//                 />
//               </div>
//             </div>
//           </div>

//           {role === 'buyer' &&
//             pathname === '/dashboard' &&
//             buyerScrollData &&
//             !loadingBuyerScrollData &&
//             Object.entries(buyerScrollData?.data).filter(
//               ([_, value]) => (value as any).count > 0,
//             ).length > 0 && (
//               <Marquee className="relative bg-gray-400 bg-center bg-cover h-[51px] my-10">
//                 {Object.entries(buyerScrollData?.data)
//                   .filter(([_, value]) => (value as any).count > 0)
//                   .map(([key, value]) => (
//                     <div
//                       key={key}
//                       className="flex items-center gap-2 text-white mr-10"
//                     >
//                       <ProductRenderer product={value as any} />
//                       <span>
//                         {formatNumber((value as any).count)}{' '}
//                         {(value as any).unit}
//                       </span>
//                     </div>
//                   ))}
//               </Marquee>
//             )}
//         </div>
//       </>
//     )
//   );
// };

// export default DashboardHeader;


'use client';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { NavLink } from './nav-link';
import { FGBell, FGChat, FGClipboard, FGShip } from '@fg-icons';
import tilesBg from '@assets/images/tilesBg.svg';
import { AuthContext } from '@/contexts/AuthContext';
import whiteLogo from '@assets/images/logo_white.svg';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Roles } from '@/features/authentication/types/authentication.types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ChevronDown, Home, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { CHAT, DASHBOARD, MY_ORDERS, RFQ } from '@/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Marquee from 'react-fast-marquee';
import useBuyerDashboardHook from '../hooks/useBuyerDashboard.hook';
import ProductRenderer from '@/components/atoms/product-renderer';
import { formatNumber } from '@/utils/formatNumber';
import { useSocket } from '@/contexts/SocketContext';
import useNotificationHook from '@/hooks/useNotification.hook';
import Logo from './Logo';

const DashboardHeader = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const { user, resetUser } = useContext(AuthContext);
  const { badgeCounts, isConnected, markCategoryAsRead } = useSocket();
  const { useGetBadgeCounts } = useNotificationHook();
  const router = useRouter();
  const pathname = usePathname();
  
  const role: Roles | undefined = user?.data?.role;
  const userId = user?.data?._id;
  const { buyerScrollData, loadingBuyerScrollData } = useBuyerDashboardHook();
  
  // Fetch initial badge counts (fallback if socket is not connected)
  const { data: fallbackBadgeCounts, isLoading: isLoadingBadges } =
    useGetBadgeCounts(userId || '');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use socket badge counts if available, otherwise use fallback from API
  
  const effectiveBadgeCounts = isConnected ? badgeCounts : (fallbackBadgeCounts || badgeCounts);

  const handleSheetToggle = useCallback(() => {
    setOpenSheet((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    resetUser && resetUser();
    router.push('/login');
  }, [resetUser, router]);

  // Navigation handlers with badge clearing
  const gotoMyOrders = useCallback(async () => {
    // Determine which category to clear based on user role and current orders
    // const orderCategory = role === 'buyer' ? 'product_order' : 'truck_order';
    
    // Only mark as read if there are unread notifications
    if (effectiveBadgeCounts.product_order > 0) {
      await markCategoryAsRead('product_order');
    }
    
    router.push(MY_ORDERS);
  }, [effectiveBadgeCounts.product_order, markCategoryAsRead, router]);

  const gotoRFQ = useCallback(async () => {
    // RFQ typically relates to truck orders
    if (effectiveBadgeCounts.truck_order > 0) {
      await markCategoryAsRead('truck_order');
    }
    
    router.push(RFQ);
  }, [effectiveBadgeCounts.truck_order, markCategoryAsRead, router]);

  const gotoChats = useCallback(async () => {
    // Mark chat notifications as read
    if (effectiveBadgeCounts.chat > 0) {
      await markCategoryAsRead('chat');
    }
    
    router.push(CHAT);
  }, [effectiveBadgeCounts.chat, markCategoryAsRead, router]);

  const gotoNotifications = useCallback(() => {
    // For now, just log - you can implement a notifications page later
    console.log('Notifications clicked');
    // router.push('/notifications');
  }, []);

  // Show loading state while mounting or fetching initial data
  if (!isMounted || (isLoadingBadges && !isConnected)) {
    return (
      <div className="relative bg-dark-400 pt-10 h-[379px] animate-pulse">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="w-24 h-16 bg-gray-600 rounded"></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-12 h-12 bg-gray-600 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const MobileMenu = () => {
    return (
      <Sheet open={openSheet} onOpenChange={handleSheetToggle}>
        <SheetTrigger className="md:hidden">
          <Menu color="white" height={40} width={40} />
        </SheetTrigger>
        <SheetContent className="w-full px-14 py-28">
          <SheetTitle />
          <SheetDescription />
          <div className="grid grid-cols-1 gap-14">
            <Link
              href={DASHBOARD}
              className="flex justify-start items-center gap-2 text-lg text-gray-600"
              onClick={handleSheetToggle}
            >
              <Home color="black" height={22} width={22} />
              Dashboard
            </Link>
            
            <button
              onClick={() => {
                gotoChats();
                handleSheetToggle();
              }}
              className="flex justify-start items-center gap-2 text-lg text-gray-600"
            >
              <FGChat color="black" height={24} width={24} />
              Chats
              {effectiveBadgeCounts.chat > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs min-w-[20px] text-center">
                  {effectiveBadgeCounts.chat > 99 ? '99+' : effectiveBadgeCounts.chat}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                gotoRFQ();
                handleSheetToggle();
              }}
              className="flex justify-start items-center gap-2 text-lg text-gray-600"
            >
              <FGClipboard color="black" height={24} width={24} />
              RFQ
              {effectiveBadgeCounts.truck_order > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs min-w-[20px] text-center">
                  {effectiveBadgeCounts.truck_order > 99 ? '99+' : effectiveBadgeCounts.truck_order}
                </span>
              )}
            </button>
         
            {/* {(role === 'buyer' || role === 'seller') && (
              <button
                onClick={() => {
                  gotoMyOrders();
                  handleSheetToggle();
                }}
                className="flex justify-start items-center gap-2 text-lg text-gray-600"
              >
                <FGShip color="black" height={24} width={24} />
                Orders
                {effectiveBadgeCounts.product_order > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs min-w-[20px] text-center">
                    {effectiveBadgeCounts.product_order > 99 ? '99+' : effectiveBadgeCounts.product_order}
                  </span>
                )}
              </button>
            )} */}
            
            {/* <button
              onClick={() => {
                gotoNotifications();
                handleSheetToggle();
              }}
              className="flex justify-start items-center gap-2 text-lg text-gray-600"
            >
              <FGBell color="black" height={24} width={24} />
              Notifications
            </button> */}
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 justify-start text-lg text-gray-600">
                <div className="relative h-7 w-7 rounded-full overflow-hidden border border-gray-600">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="" className="object-cover" />
                    <AvatarFallback>
                      {user?.data?.firstName?.substring(0, 1) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {user?.data?.firstName || 'User'}
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <>
      <div
        className={cn(
          'relative bg-dark-400 pt-10 overflow-hidden max-sm:h-[800px]',
          role === 'buyer' ? 'h-[411px] rounded-b-[30px]' : 'h-[379px]',
        )}
      >
        {role === 'buyer' && (
          <div className="absolute top-0 right-0 bottom-0 h-full w-full">
            <Image
              src={tilesBg}
              fill
              alt="Tiles BG"
              className="object-cover"
            />
          </div>
        )}

        <div className="relative container mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* <Link href={DASHBOARD}>
              <Image src={whiteLogo} width={99} height={67} alt="Logo" />
            </Link> */}
<Logo white link={DASHBOARD} />
            <MobileMenu />

            <div className="flex flex-wrap items-center gap-2 max-md:hidden">
              <NavLink
                icon={<FGChat color="#FEFEFE" />}
                frame="icon"
                onClick={gotoChats}
                label="Chats"
                count={effectiveBadgeCounts.chat}
              />
              
              <NavLink
                icon={<FGClipboard color="#FEFEFE" />}
                frame="icon"
                onClick={gotoRFQ}
                label="RFQ"
                count={effectiveBadgeCounts.truck_order}
              />
              
              {/* {(role === 'buyer' || role === 'seller') && (
                <NavLink
                  icon={<FGShip color="#FEFEFE" />}
                  label="Orders"
                  frame="icon"
                  onClick={gotoMyOrders}
                  count={effectiveBadgeCounts.product_order}
                />
              )} */}
              
              {/* <NavLink
                icon={<FGBell color="#FEFEFE" />}
                frame="icon"
                onClick={gotoNotifications}
                // You can add a general notification count here if needed
                // count={effectiveBadgeCounts.product_order + effectiveBadgeCounts.truck_order + effectiveBadgeCounts.chat}
              /> */}
              
              <NavLink
                icon={
                  <Avatar className="h-full w-full">
                    <AvatarImage src="" className="object-cover" />
                    <AvatarFallback className="text-black">
                      {user?.data?.firstName?.substring(0, 1) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                }
                frame="picture"
                label={user?.data?.firstName || 'User'}
                dropdown
                dropdownOptions={[{ title: 'Logout', action: handleLogout }]}
              />
            </div>
          </div>

          {/* Connection Status Indicator (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-2 right-2">
              <div
                className={cn(
                  'w-3 h-3 rounded-full',
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                )}
                title={isConnected ? 'Socket Connected' : 'Socket Disconnected'}
              />
            </div>
          )}
        </div>

        {/* Buyer Scroll Data */}
        {role === 'buyer' &&
          pathname === '/dashboard' &&
          buyerScrollData &&
          !loadingBuyerScrollData &&
          Object.entries(buyerScrollData?.data).filter(
            ([_, value]) => (value as any).count > 0,
          ).length > 0 && (
            <Marquee className="relative bg-gray-400 bg-center bg-cover h-[51px] my-10">
              {Object.entries(buyerScrollData?.data)
                .filter(([_, value]) => (value as any).count > 0)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-white mr-10"
                  >
                    <ProductRenderer product={value as any} />
                    <span>
                      {formatNumber((value as any).count)}{' '}
                      {(value as any).unit}
                    </span>
                  </div>
                ))}
            </Marquee>
          )}
      </div>
    </>
  );
};

export default DashboardHeader;