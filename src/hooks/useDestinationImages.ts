import { useState, useEffect, useCallback } from 'react';

interface DestinationImage {
  id: string;
  url: string;
  alt: string;
  photographer?: string;
}

// High-quality destination images from Unsplash for common destinations
const destinationImageMap: Record<string, string[]> = {
  // Asia
  'hong kong': [
    'https://images.unsplash.com/photo-1536599018102-9f6f8efb5e1b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506970845246-98f62a7e9c8f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576788369575-4ab045b9287e?w=800&h=600&fit=crop',
  ],
  'tokyo': [
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549693578-d683be217e58?w=800&h=600&fit=crop',
  ],
  'japan': [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&h=600&fit=crop',
  ],
  'singapore': [
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496939376851-89342e90adcd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541631432-1e2e6f04d72e?w=800&h=600&fit=crop',
  ],
  'dubai': [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533395427226-788cee25cc7b?w=800&h=600&fit=crop',
  ],
  'bangkok': [
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583334648584-6a22403f8a8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&h=600&fit=crop',
  ],
  'thailand': [
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534008897995-27a23e859048?w=800&h=600&fit=crop',
  ],
  'bali': [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&h=600&fit=crop',
  ],
  'maldives': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],
  'vietnam': [
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
  ],
  // Europe
  'paris': [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
  ],
  'france': [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=800&h=600&fit=crop',
  ],
  'london': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529180184525-78f99adb8e98?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&h=600&fit=crop',
  ],
  'rome': [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&h=600&fit=crop',
  ],
  'italy': [
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?w=800&h=600&fit=crop',
  ],
  'barcelona': [
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579282240050-352db0a14c21?w=800&h=600&fit=crop',
  ],
  'switzerland': [
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?w=800&h=600&fit=crop',
  ],
  'norway': [
    'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516496636080-14fb876e029d?w=800&h=600&fit=crop',
  ],
  // Americas
  'new york': [
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=800&h=600&fit=crop',
  ],
  'usa': [
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1476391907330-c39d0268a362?w=800&h=600&fit=crop',
  ],
  // Oceania
  'sydney': [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524820197278-540916411e20?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526995003517-7ae53e6b6b2d?w=800&h=600&fit=crop',
  ],
  'australia': [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513395295099-0b4e8d488b72?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494233892892-84542a694e72?w=800&h=600&fit=crop',
  ],
  // India
  'goa': [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587922546307-776227941871?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&h=600&fit=crop',
  ],
  'kerala': [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1593693398941-e36b5fd7c11b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609766418204-df7e0de7f6d1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&h=600&fit=crop',
  ],
  'rajasthan': [
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&h=600&fit=crop',
  ],
  'delhi': [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=800&h=600&fit=crop',
  ],
  'mumbai': [
    'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&h=600&fit=crop',
  ],
};

// Activity type specific images
const activityTypeImages: Record<string, string[]> = {
  flight: [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop',
  ],
  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop',
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
  ],
};

export function useDestinationImages(destination: string) {
  const [images, setImages] = useState<string[]>([]);
  const [heroImage, setHeroImage] = useState<string>('');
  
  useEffect(() => {
    if (!destination) return;
    
    const normalizedDestination = destination.toLowerCase().trim();
    
    // Find matching images
    let foundImages: string[] = [];
    
    // Try exact match first
    if (destinationImageMap[normalizedDestination]) {
      foundImages = destinationImageMap[normalizedDestination];
    } else {
      // Try partial match
      for (const [key, imgs] of Object.entries(destinationImageMap)) {
        if (normalizedDestination.includes(key) || key.includes(normalizedDestination)) {
          foundImages = imgs;
          break;
        }
      }
    }
    
    // Fallback to generic travel images
    if (foundImages.length === 0) {
      foundImages = [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=800&h=600&fit=crop',
      ];
    }
    
    setImages(foundImages);
    setHeroImage(foundImages[0] || '');
  }, [destination]);
  
  const getActivityImage = useCallback((type: string, activityTitle: string, index: number): string => {
    const normalizedDestination = destination.toLowerCase().trim();
    
    // For activities, try to use destination-specific images
    if (type === 'activity') {
      const destImages = destinationImageMap[normalizedDestination] || images;
      if (destImages.length > 0) {
        return destImages[(index + 1) % destImages.length];
      }
    }
    
    // For specific types, use type-specific images
    const typeImages = activityTypeImages[type];
    if (typeImages && typeImages.length > 0) {
      return typeImages[index % typeImages.length];
    }
    
    // Fallback
    return images[index % Math.max(images.length, 1)] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop';
  }, [destination, images]);
  
  return {
    images,
    heroImage,
    getActivityImage,
  };
}

export function getDestinationHeroImage(destination: string): string {
  const normalizedDestination = destination.toLowerCase().trim();
  
  if (destinationImageMap[normalizedDestination]) {
    return destinationImageMap[normalizedDestination][0];
  }
  
  // Try partial match
  for (const [key, imgs] of Object.entries(destinationImageMap)) {
    if (normalizedDestination.includes(key) || key.includes(normalizedDestination)) {
      return imgs[0];
    }
  }
  
  // Fallback
  return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop';
}
