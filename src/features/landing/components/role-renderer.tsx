'use client';
import React, {
  HTMLAttributes,
  lazy,
  Suspense,
  useCallback,
  useContext,
} from 'react';
import { FGTruck } from '@fg-icons';
import { BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
const Supplier = lazy(() => import('./supplier'));
const Transporter = lazy(() => import('./transporter'));
const Buyer = lazy(() => import('./buyer'));
import { LandingContext } from '../contexts/LandingContext';
import Loading from './loading';
import { Roles } from '@/features/authentication/types/authentication.types';

type RendererTab = HTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  active: boolean;
};

const RendererTab = ({ children, active, ...attributes }: RendererTab) => {
  return (
    <button
      className={cn(
        'flex items-center justify-center text-base gap-1.5 h-11 w-full',
        active
          ? 'rounded-full px-4 bg-white border font-semibold border-green-tone-375 text-deep-gray-300'
          : 'text-dark-gray-400',
      )}
      {...attributes}
    >
      {children}
    </button>
  );
};

const RoleRenderer = () => {
  const { activeTab, setActiveTab } = useContext(LandingContext);

  const handleTabChange = useCallback(
    (payload: Roles) => {
      setActiveTab && setActiveTab(payload);
    },
    [setActiveTab],
  );

  return (
    <div
      id="roles"
      className="relative bg-light-gray-250 rounded-t-[40px] py-20 min-h-[897px] -mt-10"
    >
      <div className="flex items-center justify-evenly p-1.5 mb-14 border gap-2 border-green-tone-350 mx-auto w-[398px] h-[58px] bg-light-gray-475 rounded-full">
        <RendererTab
          active={activeTab === 'seller'}
          onClick={() => handleTabChange('seller')}
        >
          <BookOpen height={18} width={18} color="#1E1E1E" />
          Suppliers
        </RendererTab>
        <RendererTab
          active={activeTab === 'transporter'}
          onClick={() => handleTabChange('transporter')}
        >
          <FGTruck height={18} width={18} color="#666666" />
          Transporters
        </RendererTab>
        <RendererTab
          active={activeTab === 'buyer'}
          onClick={() => handleTabChange('buyer')}
        >
          <Users height={18} width={18} color="#666666" />
          Traders
        </RendererTab>
      </div>

      <Suspense fallback={<Loading />}>
        {activeTab === 'seller' && <Supplier />}
        {activeTab === 'transporter' && <Transporter />}
        {activeTab === 'buyer' && <Buyer />}
      </Suspense>
    </div>
  );
};

export default RoleRenderer;



// 'use client';
// import React, {
//   HTMLAttributes,
//   lazy,
//   Suspense,
//   useCallback,
//   useContext,
// } from 'react';
// import { FGTruck } from '@fg-icons';
// import { BookOpen, Users, ChevronRight } from 'lucide-react';
// import { cn } from '@/lib/utils';
// const Supplier = lazy(() => import('./supplier'));
// const Transporter = lazy(() => import('./transporter'));
// const Buyer = lazy(() => import('./buyer'));
// import { LandingContext } from '../contexts/LandingContext';
// import { AuthContext } from '@/contexts/AuthContext';
// import Loading from './loading';
// import { Roles } from '@/features/authentication/types/authentication.types';
// import CustomButton from '@/components/atoms/custom-button';
// import { useRouter } from 'next/navigation';
// import { DASHBOARD } from '@/routes';

// type RendererTab = HTMLAttributes<HTMLButtonElement> & {
//   children: React.ReactNode;
//   active: boolean;
// };

// const RendererTab = ({ children, active, ...attributes }: RendererTab) => {
//   return (
//     <button
//       className={cn(
//         'flex items-center justify-center text-base gap-1.5 h-11 w-full',
//         active
//           ? 'rounded-full px-4 bg-white border font-semibold border-green-tone-375 text-deep-gray-300'
//           : 'text-dark-gray-400',
//       )}
//       {...attributes}
//     >
//       {children}
//     </button>
//   );
// };

// const RoleRenderer = () => {
//   const {
//     activeTab,
//     setActiveTab,
//     handleSignIn,
//     handleBuyerSignUp,
//     handleTransporterSignUp,
//     handleSellerSignUp,
//   } = useContext(LandingContext);
//   const { user } = useContext(AuthContext);
//   const router = useRouter();

//   // Check if user is logged in
//   const isLoggedIn = !!user?.data?._id;
//   const userRole = user?.data?.role;

//   const handleTabChange = useCallback(
//     (payload: Roles) => {
//       setActiveTab && setActiveTab(payload);
//     },
//     [setActiveTab],
//   );

//   const handleDashboardNavigation = () => {
//     router.push(DASHBOARD);
//   };

//   const getSignUpHandler = () => {
//     switch (activeTab) {
//       case 'seller':
//         return handleSellerSignUp;
//       case 'transporter':
//         return handleTransporterSignUp;
//       case 'buyer':
//         return handleBuyerSignUp;
//       default:
//         return handleSellerSignUp;
//     }
//   };

//   const getSignUpLabel = () => {
//     switch (activeTab) {
//       case 'seller':
//         return 'Sign Up as Supplier';
//       case 'transporter':
//         return 'Sign Up as Transporter';
//       case 'buyer':
//         return 'Sign Up as Trader';
//       default:
//         return 'Sign Up as Supplier';
//     }
//   };

//   return (
//     <div
//       id="roles"
//       className="relative bg-light-gray-250 rounded-t-[40px] py-20 min-h-[897px] -mt-10"
//     >
//       <div className="flex items-center justify-evenly p-1.5 mb-14 border gap-2 border-green-tone-350 mx-auto w-[398px] h-[58px] bg-light-gray-475 rounded-full">
//         <RendererTab
//           active={activeTab === 'seller'}
//           onClick={() => handleTabChange('seller')}
//         >
//           <BookOpen height={18} width={18} color="#1E1E1E" />
//           Suppliers
//         </RendererTab>
//         <RendererTab
//           active={activeTab === 'transporter'}
//           onClick={() => handleTabChange('transporter')}
//         >
//           <FGTruck height={18} width={18} color="#666666" />
//           Transporters
//         </RendererTab>
//         <RendererTab
//           active={activeTab === 'buyer'}
//           onClick={() => handleTabChange('buyer')}
//         >
//           <Users height={18} width={18} color="#666666" />
//           Traders
//         </RendererTab>{' '}
//       </div>

//       {/* Conditional Action Buttons */}
//       <div className="flex items-center justify-center mb-14">
//         {isLoggedIn ? (
//           <CustomButton
//             onClick={handleDashboardNavigation}
//             variant="glow"
//             label="Go to Dashboard"
//             width="w-fit"
//             height="h-12"
//           />
//         ) : (
//           <div className="flex items-center gap-4">
//             <CustomButton
//               onClick={getSignUpHandler()}
//               variant="glow"
//               label={getSignUpLabel()}
//               width="w-fit"
//               height="h-12"
//             />
//             <CustomButton
//               onClick={handleSignIn}
//               variant="plain"
//               label="Sign In"
//               width="w-[142px]"
//               color="text-black hover:text-black/50"
//               rightIcon={<ChevronRight color="black" />}
//               height="h-12"
//             />
//           </div>
//         )}
//       </div>

//       <Suspense fallback={<Loading />}>
//         {activeTab === 'seller' && <Supplier />}
//         {activeTab === 'transporter' && <Transporter />}
//         {activeTab === 'buyer' && <Buyer />}
//       </Suspense>
//     </div>
//   );
// };

// export default RoleRenderer;
