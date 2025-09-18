import React, { useState, useCallback, useMemo } from 'react';
import useDepotHubHook from '@/hooks/useDepotHub.hook';
import useTruckListingHook from '../hooks/useTruckListing.hook';
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
import { TRUCK_SIZES } from '@/data/truck-sizes';
import { formatNumber } from '@/utils/formatNumber';
import {
  Calculator as CalculatorIcon,
  Truck,
  MapPin,
  Package,
  Route,
  TrendingUp,
  Info,
} from 'lucide-react';




interface CalculationBreakdown {
  freightRateMin: number;
  freightRateMax: number;
  dieselDeliveryCostMin: number;
  dieselDeliveryCostMax: number;
  dieselQuantityMin: number;
  dieselQuantityMax: number;
  variableCostPerKmMin: number;
  variableCostPerKmMax: number;
  fixedCostPerKm: number;
  distance: number;
  truckCapacity: number;
}

const Calculator = () => {
  const { useFetchLoadPoints, useCalculateFare } = useTransportFareHook();
  const { useFetchStates, useFetchStateLGA } = useStateHook();

  // State management
  const [selectedTruck, setSelectedTruck] = useState<any>(undefined);
  const [truckType, setTruckType] = useState<string | undefined>(undefined);
  const [truckCategory, setTruckCategory] = useState<string | undefined>(undefined);
  const [truckCapacity, setTruckCapacity] = useState<number | undefined>(undefined);
  const [deliveryState, setDeliveryState] = useState<
    CustomSelectOption | undefined
  >();
  const [deliveryLGA, setDeliveryLGA] = useState<
    CustomSelectOption | undefined
  >();
  const [hub, setHub] = useState<CustomSelectOption | undefined>();
  const [loadPoint, setLoadPoint] = useState<CustomSelectOption | undefined>();
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [fuelPrice, setFuelPrice] = useState<number | undefined>(undefined);

  // Fetch data
  const { data: loadPointsRes, isLoading: loadingLoadPoints } = useFetchLoadPoints;
  const { useFetchDepotHubs } = useDepotHubHook();
  const { data: depotHubsRes, isLoading: loadingDepotHubs } = useFetchDepotHubs;
  const { data: stateRes, isLoading: loadingStates } = useFetchStates;
  const { data: lgaRes, isLoading: loadingLGA } = useFetchStateLGA(deliveryState?.value);
  const { mutateAsync: calculateFare, isPending: isCalculating } = useCalculateFare();
  const {
    userTrucks,
    isLoadingUserTrucks,
  } = useTruckListingHook();

  // Formatted data for dropdowns

  // --- Tanker: hub = depot hub, loadpoint = depot in hub ---
  const tankerHubs = useMemo(() => {
    if (!depotHubsRes?.data) return [];
    return depotHubsRes.data
      .filter((hub: any) => hub.type === 'tanker')
      .map((hub: any) => ({ label: hub.name, value: hub._id, depots: hub.depots }));
  }, [depotHubsRes]);

  const tankerLoadPoints = useMemo(() => {
    if (!hub) return [];
    const found = tankerHubs.find((h: any) => h.value === hub.value);
    if (!found) return [];
    return (found.depots || []).map((depot: string) => ({ label: depot, value: depot }));
  }, [hub, tankerHubs]);

  // --- Non-tanker: hub = state from loadPoints, loadpoint = loadPoints in state ---
  const nonTankerStates = useMemo(() => {
    if (!loadPointsRes?.data) return [];
    const uniqueStates = Array.from(new Set(loadPointsRes.data.map((p: any) => p.state))) as string[];
    return uniqueStates.map((state) => ({ label: state, value: state }));
  }, [loadPointsRes]);

  const nonTankerLoadPoints = useMemo(() => {
    if (!hub || !loadPointsRes?.data) return [];
    return loadPointsRes.data
      .filter((p: any) => p.state === hub.value)
      .map((p: any) => ({ label: p.displayName, value: p.name }));
  }, [hub, loadPointsRes]);

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

    const truckOptions = useMemo(() => {
    if (!userTrucks?.pages) return [];
    // Flatten all pages
    return userTrucks.pages.flatMap((page: any) =>
      (page.data.trucks || []).map((truck: any) => ({
        label: `${truck.truckNumber} (${truck.truckType})`,
        value: truck._id,
        truckType: truck.truckType,
        truckCategory: truck.truckCategory,
        truckCapacity: truck.truckCapacity,
        raw: truck,
      }))
    );
  }, [userTrucks]);

  // Trucks dropdown options
  // const truckOptions = useMemo(() => {
  //   if (!userTrucks?.pages) return [];
  //   // Flatten all pages and filter only tanker trucks
  //   return userTrucks.pages.flatMap((page: any) =>
  //     (page.data.trucks || [])
  //       .filter((truck: any) => truck.truckType === 'tanker')
  //       .map((truck: any) => ({
  //         label: `${truck.truckNumber} (${truck.truckType})`,
  //         value: truck._id,
  //         truckType: truck.truckType,
  //         truckCategory: truck.truckCategory,
  //         truckCapacity: truck.truckCapacity,
  //         raw: truck,
  //       }))
  //   );
  // }, [userTrucks]);

  // Handlers
  const handleStateChange = useCallback((value: unknown) => {
    setDeliveryState(value as CustomSelectOption | undefined);
    setDeliveryLGA(undefined);
  }, []);

  const handleLGAChange = useCallback((value: unknown) => {
    setDeliveryLGA(value as CustomSelectOption | undefined);
  }, []);

  // When truck changes, update truckType, truckCategory, truckCapacity
  const handleTruckChange = useCallback((option: any) => {
  setSelectedTruck(option);
  setTruckType(option?.truckType);
  setTruckCategory(option?.truckCategory);
  setTruckCapacity(option?.raw?.capacity);
  setFuelPrice(undefined); // reset fuel price when truck changes
  }, []);

  const handleCalculate = useCallback(async () => {
    if (!selectedTruck || !deliveryState || !deliveryLGA || !loadPoint) {
      return;
    }
    try {
      const result = await calculateFare({
        truckCapacity: truckCapacity as number,
        truckType: truckType as string,
        truckCategory: truckCategory as string,
        deliveryState: deliveryState.value,
        deliveryLGA: deliveryLGA.value,
        loadPoint: loadPoint.value,
        fuelPricePerLitre: fuelPrice as number,
      });
      if (result.statusCode === 200) {
        setCalculationResult(result.data);
      }
    } catch (error) {
      console.error('Calculation failed:', error);
    }
  }, [selectedTruck, truckCapacity, truckType, truckCategory, deliveryState, deliveryLGA, loadPoint, fuelPrice, calculateFare]);

  const isFormValid = selectedTruck && deliveryState && deliveryLGA && loadPoint;
// console.log(selectedTruck)
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <CalculatorIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <Heading variant="h4" color="text-gray-900" fontWeight="bold">
            Transport Fare Calculator
          </Heading>
          <Text variant="ps" color="text-gray-600">
            Calculate accurate fare estimates for your transport routes
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculation Form */}
        <Card className="p-6 border border-gray-200 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-blue-500" />
              <Text variant="pl" fontWeight="semibold" color="text-gray-900">
                Trip Details
              </Text>
            </div>

            {/* Truck Select */}
            <div>
              <CustomSelect
                label="Truck"
                name="selectedTruck"
                options={truckOptions}
                value={selectedTruck}
                onChange={handleTruckChange}
                placeholder={isLoadingUserTrucks ? "Loading trucks..." : "Truck"}
                isDisabled={isLoadingUserTrucks}
                classNames="border-gray-300"
              />
              {selectedTruck && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-semibold">Type:</span> {truckType} |{" "}
                  <span className="font-semibold">Category:</span> {truckCategory} |{" "}
                  <span className="font-semibold">Capacity:</span> {truckCapacity}{" "}
                  {truckType === "tanker" ? "Ltrs" : "T"}
                </div>
              )}
            </div>

            {/* Fuel Price Input */}
            {selectedTruck && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {(truckCategory === 'A++' || selectedTruck?.raw?.fuelType === 'cng') ? 'CNG Price (₦/Litre)' : 'Diesel Price (₦/Litre)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={fuelPrice === undefined ? '' : fuelPrice}
                  onChange={e => setFuelPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={(truckCategory === 'A++' || selectedTruck?.raw?.truckFuelType === 'cng') ? 'Enter CNG price' : 'Enter diesel price'}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

              {/* Hub and Load Point fields */}
              {selectedTruck?.truckType === 'tanker' ? (
                <>
                  <CustomSelect
                    label="Hub"
                    name="hub"
                    options={tankerHubs}
                    value={hub}
                    onChange={(value) => {
                      setHub(value as CustomSelectOption);
                      setLoadPoint(undefined);
                    }}
                    placeholder="Select hub"
                    isDisabled={loadingDepotHubs}
                    classNames="border-gray-300"
                  />
                  <CustomSelect
                    label="Load Point (Depot)"
                    name="loadPoint"
                    options={tankerLoadPoints}
                    value={loadPoint}
                    onChange={(value) => setLoadPoint(value as CustomSelectOption)}
                    placeholder="Select depot"
                    isDisabled={!hub}
                    classNames="border-gray-300"
                  />
                </>
              ) : (
                <>
                  <CustomSelect
                    label="Hub"
                    name="hub"
                    options={nonTankerStates}
                    value={hub}
                    onChange={(value) => {
                      setHub(value as CustomSelectOption);
                      setLoadPoint(undefined);
                    }}
                    placeholder="Select state"
                    isDisabled={loadingLoadPoints}
                    classNames="border-gray-300"
                  />
                  <CustomSelect
                    label="Load Point (Origin)"
                    name="loadPoint"
                    options={nonTankerLoadPoints}
                    value={loadPoint}
                    onChange={(value) => setLoadPoint(value as CustomSelectOption)}
                    placeholder="Select load point"
                    isDisabled={!hub}
                    classNames="border-gray-300"
                  />
                </>
              )}

            {/* Delivery Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CustomSelect
                  label="Delivery State"
                  name="deliveryState"
                  options={states}
                  value={deliveryState}
                  onChange={handleStateChange}
                  placeholder="State"
                  isDisabled={loadingStates}
                  classNames="border-gray-300"
                />
              </div>
              <div>
                <CustomSelect
                  label="Delivery LGA"
                  name="deliveryLGA"
                  options={lgas}
                  value={deliveryLGA}
                  onChange={handleLGAChange}
                  placeholder="LGA"
                  isDisabled={loadingLGA || !deliveryState}
                  classNames="border-gray-300"
                />
              </div>
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
          </div>
        </Card>

        {/* Results */}
        <Card className="p-6 border border-gray-200 shadow-sm">
          {calculationResult ? (
            <div className="space-y-6">
              {/* Result Header */}
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <Text variant="pl" fontWeight="semibold" color="text-gray-900">
                  Fare Calculation Results
                </Text>
              </div>

              {/* Fare Range */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="text-center space-y-2">
                  <Text variant="ps" color="text-green-700" fontWeight="medium">
                    Fare Per Litre Range
                  </Text>
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-800">
                    <span>
                      ₦{formatNumber(calculationResult.minFarePerLitre)}
                    </span>
                    <span className="text-green-600">-</span>
                    <span>
                      ₦{formatNumber(calculationResult.maxFarePerLitre)}
                    </span>
                  </div>
                  <Text variant="ps" color="text-green-600">
                    Total: ₦{formatNumber(calculationResult.totalMin)} - ₦
                    {formatNumber(calculationResult.totalMax)}
                  </Text>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <Text
                    variant="pm"
                    fontWeight="semibold"
                    color="text-gray-900"
                  >
                    Cost Breakdown
                  </Text>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* Distance */}
                  <div className="flex md:flex-row flex-col md:items-center md:justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Route className="w-4 h-4 text-gray-500" />
                      <Text variant="ps" color="text-gray-700">
                        Distance
                      </Text>
                    </div>
                    <Text
                      variant="ps"
                      fontWeight="semibold"
                      color="text-gray-900 whitespace-nowrap text-right"
                    >
                      {formatNumber(calculationResult.breakdowns.distance)} km
                    </Text>
                  </div>

                  {/* Freight Rate */}
                  <div className="flex md:flex-row flex-col md:items-center md:justify-between p-3 bg-gray-50 rounded-lg">
                    <Text variant="ps" color="text-gray-700">
                      Freight Rate
                    </Text>
                    <Text
                      variant="ps"
                      fontWeight="semibold"
                      color="text-gray-900 whitespace-nowrap text-right"
                    >
                      ₦{formatNumber(calculationResult.breakdowns.freightRateMin)} - ₦{formatNumber(calculationResult.breakdowns.freightRateMax)}
                    </Text>
                  </div>

                  {/* Diesel Delivery Cost */}
                  <div className="flex md:flex-row flex-col md:items-center md:justify-between p-3 bg-gray-50 rounded-lg">
                    <Text variant="ps" color="text-gray-700">
                      Diesel Delivery Cost
                    </Text>
                    <Text
                      variant="ps"
                      fontWeight="semibold"
                      color="text-gray-900 whitespace-nowrap text-right"
                    >
                      ₦{formatNumber(calculationResult.breakdowns.dieselDeliveryCostMin)} - ₦{formatNumber(calculationResult.breakdowns.dieselDeliveryCostMax)}
                    </Text>
                  </div>

                  {/* Diesel Quantity */}
                  <div className="flex md:flex-row flex-col md:items-center md:justify-between p-3 bg-gray-50 rounded-lg">
                    <Text variant="ps" color="text-gray-700">
                      Diesel Quantity (Round Trip)
                    </Text>
                    <Text
                      variant="ps"
                      fontWeight="semibold"
                      color="text-gray-900 whitespace-nowrap text-right"
                    >
                      {formatNumber(calculationResult.breakdowns.dieselQuantityMin)} - {formatNumber(calculationResult.breakdowns.dieselQuantityMax)} Ltrs
                    </Text>
                  </div>

                  {/* Variable Cost per KM */}
                  <div className="flex md:flex-row flex-col md:items-center md:justify-between p-3 bg-gray-50 rounded-lg">
                    <Text variant="ps" color="text-gray-700">
                      Variable Cost/KM
                    </Text>
                    <Text
                      variant="ps"
                      fontWeight="semibold"
                      color="text-gray-900 whitespace-nowrap text-right"
                    >
                      ₦{formatNumber(calculationResult.breakdowns.variableCostPerKmMin)} - ₦{formatNumber(calculationResult.breakdowns.variableCostPerKmMax)}
                    </Text>
                  </div>

                  {/* Fixed Cost per KM */}
                  <div className="flex md:flex-row flex-col md:items-center md:justify-between p-3 bg-gray-50 rounded-lg">
                    <Text variant="ps" color="text-gray-700">
                      Fixed Cost/KM
                    </Text>
                    <Text
                      variant="ps"
                      fontWeight="semibold"
                      color="text-gray-900 whitespace-nowrap text-right"
                    >
                      ₦{formatNumber(calculationResult.breakdowns.fixedCostPerKm)}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <Text
                      variant="pxs"
                      color="text-blue-700"
                      fontWeight="medium"
                    >
                      Calculation includes profit margin, maintenance costs,
                      fuel consumption, and driver allowances. Rates are
                      estimates and may vary based on market conditions.
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CalculatorIcon className="w-8 h-8 text-gray-400" />
              </div>
              <Text
                variant="pl"
                fontWeight="semibold"
                color="text-gray-500"
                classNames="mb-2"
              >
                Ready to Calculate
              </Text>
              <Text variant="ps" color="text-gray-400" classNames="max-w-sm">
                Fill in the trip details on the left and click &ldquo;Calculate
                Fare&rdquo; to see your transport cost breakdown.
              </Text>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Calculator;
