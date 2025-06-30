const testProductsData = {
  seller: {
    "_id": "66c062684dd05851a9f575eb",
    "category": "depot-owner",
    "userId": "66c062394dd05851a9f575e3",
    "businessName": "Immortals Transport Company Ltd",
    "depotName": "A and B Depot",
    "phoneNumber": "7062465404",
    "officeAddress": "",
    "depotHub": "port-harcourt",
    "products": [
      "ago",
      "pms"
    ],
    "createdAt": "2024-08-17T08:42:16.277Z",
    "updatedAt": "2024-08-17T08:42:16.277Z"
  },
  product: {
    _id: 'eojvnevneoivneo',
    name: 'PMS (Premium Motor Spirits)',
    abbreviation: 'pms',
    bgColor: 'bg-green-tone-700'
  },
  depot: {
    id: '1',
    name: 'Lagos',
    count: 57,
    image: '/depots/lagos.jpeg',
  },
  availableVolume: 10000,
  openingPrice: 900,
  priceDuration: "2024-09-03T08:42:16.277Z",
  productQuality: 'https://firebasestorage.googleapis.com/v0/b/redux-http-895c8.appspot.com/o/NIN%20Card.pdf?alt=media&token=10aa09b7-3530-4ea8-974c-a0421d15093e'
}

const allTestProductsData = Array.from({ length: 20 }, (_, index) => {
  const currentDate = new Date();
  let minDuration = new Date(currentDate);
  let maxDuration = new Date(currentDate);

  // Set the minimum duration to 2 hours from now
  minDuration.setHours(minDuration.getHours() + 2);

  // Set the maximum duration to the end of the current day
  maxDuration.setHours(23, 59, 59, 999);

  // Calculate a random duration between minDuration and maxDuration
  const randomDuration = new Date(minDuration.getTime() + Math.random() * (maxDuration.getTime() - minDuration.getTime()));

  // Randomize buyerOffer to be true or false
  const buyerOffer = Math.random() < 0.5;
  const locked = Math.random() < 0.5 * 1.1;

  return {
    ...testProductsData,
    availableVolume: testProductsData.availableVolume + index * 1000,
    openingPrice: testProductsData.openingPrice + index * 10,
    productDuration: randomDuration.toISOString(),
    buyerOffer,
    locked
  };
});

const testTrucksData = {
  transporter: {
    "_id": "66c06188c3234c1af6dce86d",
    "companyName": "Company A",
    "companyAddress": "Company Street, Port Harcourt",
    "companyEmail": "companyemail@gmail.com",
    "phoneNumber": "7062465404",
    "state": "lagos",
    "userId": "66c06181c3234c1af6dce865",
    "createdAt": "2024-08-17T08:38:32.753Z",
    "updatedAt": "2024-08-17T08:38:32.753Z"
  },
  depot: {
    id: '1',
    name: 'Lagos',
    count: 57,
    image: '/depots/lagos.jpeg',
  },
  truck: {
    size: 50000
  }
}

const allTestTrucksData = Array.from({ length: 7 }, (_, index) => {
  const locked = Math.random() < 0.5 * 1.1;

  return {
    ...testTrucksData,
    truck: {
      size: Math.floor(Math.random() * (50000 - 10000 + 1) + 10000)
    },
    locked
  };
});

const testOrdersData = {
  buyer: {
    "_id": "66c061cdc3234c1af6dce879",
    "category": "reseller",
    "userId": "66c061c8c3234c1af6dce871",
    "createdAt": "2024-08-17T08:39:41.905Z",
    "updatedAt": "2024-08-17T08:39:41.905Z",
    user: {
      "_id": "66c061c8c3234c1af6dce871",
      "firstName": "Abdussamad",
      "lastName": "Bello",
      "status": "active",
      "email": "buyer@mail.com",
      "lastSeen": "2024-08-17T06:51:26.348Z",
      "createdAt": "2024-08-17T08:39:36.958Z",
      "updatedAt": "2024-08-17T08:39:36.958Z"
    }
  },
  destination: 'Ebute Ikorodu , Ikorodu, Lagos, NG',
  request: 50000,
  offer: 1450,
}

const allTestOrdersData = Array.from({ length: 8 }, (_, index) => {
  const rfq = Math.random() < 0.5 * 1.1;
  const status = ['pending', 'accepted', 'rejected'];
  const randomIndex = () => Math.floor(Math.random() * status.length);

  return {
    ...testOrdersData,
    request: Math.floor(Math.random() * (50000 - 10000 + 1) + 10000),
    rfq,
    status: status[randomIndex()]
  };
})

export { allTestProductsData, allTestTrucksData, allTestOrdersData };

