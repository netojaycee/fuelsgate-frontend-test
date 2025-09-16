import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/atoms/text';
import { Heading } from '@/components/atoms/heading';
import CustomButton from '@/components/atoms/custom-button';
import {
  CustomSelect,
  CustomSelectOption,
} from '@/components/atoms/custom-select';
import useTransportFareHook from '@/hooks/useTransportFare.hook';
import useStateHook from '@/hooks/useState.hook';
import { NON_TANKER_SIZES, TRUCK_SIZES } from '@/data/truck-sizes';
import { formatNumber } from '@/utils/formatNumber';
import { Calculator as CalculatorIcon, Package } from 'lucide-react';

// Truck type options (same as transporter)
const TRUCK_TYPES = [
  { label: 'Tanker', value: 'tanker' },
  { label: 'Flatbed', value: 'flatbed' },
  { label: 'SideWall', value: 'sidewall' },
  { label: 'Lowbed', value: 'lowbed' },
];



// Truck category options
export const TRUCK_CATEGORY_OPTIONS = [
  {
    label: 'Category A++',
    value: 'A++',
    description: 'CNG Trucks',
    ageRange: 'CNG only',
  },
  {
    label: 'Category A',
    value: 'A',
    description: 'Modern Trucks',
    ageRange: 'Less than 7 years old',
  },
  {
    label: 'Category B',
    value: 'B',
    description: 'Mid-Age Trucks',
    ageRange: '7 to 15 years old',
  },
  {
    label: 'Category C',
    value: 'C',
    description: 'Older Trucks',
    ageRange: '15+ years old',
  },
];

export default function BuyerCalculator() {
  const { useFetchLoadPoints, useCalculateFare } = useTransportFareHook();
  const { useFetchStates, useFetchStateLGA } = useStateHook();

  // State management
  const [truckType, setTruckType] = useState<CustomSelectOption | undefined>();
  const [truckCategory, setTruckCategory] = useState<CustomSelectOption | undefined>();
  const [truckCapacity, setTruckCapacity] = useState<CustomSelectOption | undefined>();
  const [destinationState, setDestinationState] = useState<CustomSelectOption | undefined>();
  const [destinationLGA, setDestinationLGA] = useState<CustomSelectOption | undefined>();
  const [loadPoint, setLoadPoint] = useState<CustomSelectOption | undefined>();
  const [fareRange, setFareRange] = useState<{ min: number; max: number } | null>(null);

  // Fetch data
  const { data: loadPointsRes, isLoading: loadingLoadPoints } = useFetchLoadPoints;
  const { data: stateRes, isLoading: loadingStates } = useFetchStates;
  const { data: lgaRes, isLoading: loadingLGA } = useFetchStateLGA(destinationState?.value);
  const { mutateAsync: calculateFare, isPending: isCalculating } = useCalculateFare();

  // Formatted data for dropdowns
  const loadPoints = useMemo(() => {
    if (loadPointsRes?.data) {
      return loadPointsRes.data.map((point: any) => ({
        label: point.displayName,
        value: point.name,
      }));
    }
    return [];
  }, [loadPointsRes]);

  const states = useMemo(() => {
    if (stateRes) {
      return stateRes.map((state: string) => ({
        label: state,
        value: state,
      }));
    }
    return [];
  }, [stateRes]);

  const lgas = useMemo(() => {
    if (lgaRes) {
      return lgaRes.map((lga: string) => ({
        label: lga,
        value: lga,
      }));
    }
    return [];
  }, [lgaRes]);

  // Handlers
  const handleStateChange = useCallback((value: unknown) => {
    setDestinationState(value as CustomSelectOption | undefined);
    setDestinationLGA(undefined);
  }, []);

  const handleLGAChange = useCallback((value: unknown) => {
    setDestinationLGA(value as CustomSelectOption | undefined);
  }, []);

  const handleCalculate = useCallback(async () => {
    if (!truckCapacity || !destinationState || !truckCategory || !destinationLGA || !loadPoint || !truckType) {
      return;
    }
    try {
      const result = await calculateFare({
        truckCapacity: parseInt(truckCapacity.value),
        truckType: truckType.value,
        truckCategory: truckCategory.value,
        deliveryState: destinationState.value,
        deliveryLGA: destinationLGA.value,
        loadPoint: loadPoint.value,
      });
      if (result.statusCode === 200 && result.data) {
        setFareRange({ min: result.data.totalMin, max: result.data.totalMax });
      }
    } catch (error) {
      setFareRange(null);
    }
  }, [truckCapacity, truckCategory, destinationState, destinationLGA, loadPoint, truckType, calculateFare]);

  const isFormValid = truckCapacity && destinationState && destinationLGA && loadPoint && truckType && truckCategory;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <CalculatorIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <Heading variant="h4" color="text-gray-900" fontWeight="bold">
            Buyer Transport Fare Calculator
          </Heading>
          <Text variant="ps" color="text-gray-600">
            Estimate transport fare for your truck between two points
          </Text>
        </div>
      </div>

      <Card className="p-6 border border-gray-200 shadow-sm max-w-xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-500" />
            <Text variant="pl" fontWeight="semibold" color="text-gray-900">
              Trip Details
            </Text>
          </div>

          {/* Truck Type */}
          <CustomSelect
            label="Truck Type"
            name="truckType"
            options={TRUCK_TYPES}
            value={truckType}
            onChange={(value) => setTruckType(value as CustomSelectOption)}
            classNames="border-gray-300"
            placeholder='Truck type'
          />

          {/* Truck Category */}
          <CustomSelect
            label="Truck Category"
            name="truckCategory"
            options={TRUCK_CATEGORY_OPTIONS.map(opt => ({
              label: `${opt.label} — ${opt.description} (${opt.ageRange})`,
              value: opt.value,
            }))}
            value={truckCategory}
            onChange={(value) => setTruckCategory(value as CustomSelectOption)}
            placeholder="Truck category"
            classNames="border-gray-300"
          />

          {/* Truck Capacity */}
          <CustomSelect
            label="Truck Capacity"
            name="truckCapacity"
            options={truckType?.value === 'tanker' ? TRUCK_SIZES : NON_TANKER_SIZES}
            value={truckCapacity}
            onChange={(value) => setTruckCapacity(value as CustomSelectOption)}
            placeholder="Truck capacity"
            classNames="border-gray-300"
          />

          {/* Load Point */}
          <CustomSelect
            label="Load Point (Origin)"
            name="loadPoint"
            options={loadPoints}
            value={loadPoint}
            onChange={(value) => setLoadPoint(value as CustomSelectOption)}
            placeholder="Load point"
            isDisabled={loadingLoadPoints}
            classNames="border-gray-300"
          />

          {/* Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              label="Destination State"
              name="destinationState"
              options={states}
              value={destinationState}
              onChange={handleStateChange}
              placeholder="State"
              isDisabled={loadingStates}
              classNames="border-gray-300"
            />
            <CustomSelect
              label="Destination LGA"
              name="destinationLGA"
              options={lgas}
              value={destinationLGA}
              onChange={handleLGAChange}
              placeholder="LGA"
              isDisabled={loadingLGA || !destinationState}
              classNames="border-gray-300"
            />
          </div>

          {/* Calculate Button */}
          <CustomButton
            variant="primary"
            onClick={handleCalculate}
            disabled={!isFormValid || isCalculating}
            loading={isCalculating}
            width="w-full"
            height="h-12"
            leftIcon={<CalculatorIcon className="w-5 h-5" />}
            label="Calculate Fare"
            classNames="mt-6"
          />

          {/* Result */}
          {fareRange !== null && (
            <div className="mt-8 text-center">
              <Text variant="pl" fontWeight="bold" color="text-green-700">
                Estimated Transport Fare Range
              </Text>
              <div className="text-3xl font-bold text-green-800 mt-2">
                ₦{formatNumber(fareRange.min)}{' '} - ₦{formatNumber(fareRange.max)}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
