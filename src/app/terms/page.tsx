import DashboardFooter from '@/features/dashboard/components/dashboard-footer';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Logo from '@assets/images/logo_gold.svg';

export default function Terms() {
  return (
    <>
    <div className="mt-10 group/navbar container mx-auto flex justify-between items-center gap-3 mb-4">
              <Image src={Logo} width={99} height={67} alt="Logo" />
              <div className="flex items-center gap-4">
                <Link href={'/'} className="text-blue-tone-400 hover:underline">
                  Home
                </Link>
              </div>
            </div>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gold mb-6 text-center">
          Fuelsgate Platform Terms &amp; Conditions
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <p className="text-base text-gray-700 mb-2">
            By generating or downloading a Fuelsgate{' '}
            <span className="font-semibold text-blue-600">Ticket Order</span>,
            you agree to these terms.
          </p>
        </div>

        {/* Transporters Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-700 mb-3 flex items-center gap-2">
            <span role="img" aria-label="truck">
              🚚
            </span>{' '}
            For Transporters (Truck Owners / Drivers)
          </h2>
          <div className="bg-green-50 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold mb-2">
              1. Our Service (Fuelsgate):
            </h3>
            <ul className="list-disc ml-6 text-gray-800">
              <li>
                Fuelsgate (
                <a
                  href="https://www.fuelsgate.com"
                  className="text-blue-600 underline"
                >
                  www.fuelsgate.com
                </a>
                ) is a <span className="font-semibold">Smart Connector</span>{' '}
                platform. We help you discover and get matched with available
                loads for your truck.
              </li>
              <li>
                We provide you with Request for Quote (RFQ) details from
                potential buyers.
              </li>
              <li>
                We generate a{' '}
                <span className="font-semibold">Ticket Order</span> when a match
                is confirmed, formalizing the agreement.
              </li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold mb-2">2. Your Commitments:</h3>
            <ul className="list-disc ml-6 text-gray-800">
              <li>
                Provide accurate and current details of your truck (license
                plate, capacity, product type) and its precise location
                (depot/park name).
              </li>
              <li>Prepare quote and respond promptly to RFQ.</li>
              <li>
                Adhere to the agreed freight cost and customer with your Bank
                details.
              </li>
              <li>
                <span className="font-semibold text-red-600">Crucially</span>,
                pay commission fee to Fuelsgate&apos;s bank account immediately
                upon successful match finalization and{' '}
                <span className="font-semibold">before product loading</span>.
                Fee &amp; Bank details are on the{' '}
                <span className="font-semibold">Ticket Order</span>.
              </li>
              <li>
                Cooperate fully with the buyer&apos;s representative at the
                depot/park.
              </li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold mb-2">
              3. Fuelsgate&apos;s Role &amp; Limits:
            </h3>
            <ul className="list-disc ml-6 text-gray-800">
              <li>
                Fuelsgate is <span className="font-semibold">ONLY</span> a
                matching and discovery platform.
              </li>
              <li>
                We are <span className="font-semibold text-red-600">NOT</span>{' '}
                responsible for:
                <ul className="list-disc ml-6">
                  <li>The actual delivery of the product.</li>
                  <li>The quantity or quality of the product.</li>
                  <li>
                    The security of your truck or product during transit (the
                    buyer&apos;s representative is responsible for escort).
                  </li>
                  <li>
                    Payment of freight cost by the buyer (this is direct between
                    you and the buyer).
                  </li>
                  <li>
                    Any loss, damage, theft, or dispute arising during or after
                    the physical transportation.
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-5">
            <h3 className="text-lg font-bold mb-2">4. Acceptance:</h3>
            <p className="text-gray-800">
              Generating or downloading the{' '}
              <span className="font-semibold">Ticket Order</span> signifies your
              full acceptance of these terms.
            </p>
          </div>
        </section>

        {/* Traders/Buyers Section */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
            <span role="img" aria-label="buyer">
              🛒
            </span>{' '}
            For Traders / Buyers (Truck Hirer)
          </h2>
          <div className="bg-blue-50 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold mb-2">
              1. Our Service (Fuelsgate):
            </h3>
            <ul className="list-disc ml-6 text-gray-800">
              <li>
                Fuelsgate (
                <a
                  href="https://www.fuelsgate.com"
                  className="text-blue-600 underline"
                >
                  www.fuelsgate.com
                </a>
                ) is a <span className="font-semibold">Smart Connector</span>{' '}
                platform. We help you discover and get matched with available
                trucks at load depots or refineries for your fuel products.
              </li>
              <li>We provide you with quotes from available transporters.</li>
              <li>
                We generate a{' '}
                <span className="font-semibold">Ticket Order</span> when a match
                is confirmed, formalizing the agreement.
              </li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold mb-2">2. Your Commitments:</h3>
            <ul className="list-disc ml-6 text-gray-800">
              <li>
                Provide accurate and complete details in your Request for Quote
                (RFQ).
              </li>
              <li>
                Adhere to the agreed freight cost and terms for the matched
                truck.
              </li>
              <li>
                <span className="font-semibold text-red-600">
                  Crucial Rule:
                </span>{' '}
                Your representative <span className="font-semibold">MUST</span>{' '}
                escort the truck from the depot to the delivery location.
              </li>
              <li>
                <span className="font-semibold text-red-600">
                  NO ESCORT, NO DEAL.
                </span>{' '}
                Fuelsgate will not facilitate any transaction where this rule is
                not followed.
              </li>
              <li>
                Pay the Transporter directly for the freight cost (offline, as
                agreed between you and the transporter).
              </li>
              <li>
                <span className="font-semibold text-red-600">Crucially</span>,
                pay commission fee to Fuelsgate&apos;s bank account immediately
                upon successful match finalization and{' '}
                <span className="font-semibold">before product loading</span>.
                Fee &amp; Bank details are on the{' '}
                <span className="font-semibold">Ticket Order</span>.
              </li>
              <li>
                Provide feedback / rating on the transporter via the platform
                after delivery.
              </li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold mb-2">
              3. Fuelsgate&apos;s Role &amp; Limits:
            </h3>
            <ul className="list-disc ml-6 text-gray-800">
              <li>
                Fuelsgate is <span className="font-semibold">ONLY</span> a
                matching and discovery platform. We do not own drivers / trucks.
              </li>
              <li>
                We are <span className="font-semibold text-red-600">NOT</span>{' '}
                responsible for:
                <ul className="list-disc ml-6">
                  <li>The actual delivery of the product.</li>
                  <li>The quantity or quality of the product.</li>
                  <li>
                    The performance of the truck or driver during transit.
                  </li>
                  <li>
                    Any loss, damage, theft, or dispute arising during or after
                    the physical transportation.
                  </li>
                  <li>
                    Ensuring the transporter receives their freight payment
                    (this is direct between you and the transporter).
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-5">
            <h3 className="text-lg font-bold mb-2">4. Acceptance:</h3>
            <p className="text-gray-800">
              Generating or downloading the{' '}
              <span className="font-semibold">Ticket Order</span> signifies your
              full acceptance of these terms.
            </p>
          </div>
        </section>
      </div>
      <DashboardFooter />
    </>
  );
}
