import { useState, useEffect, useCallback } from 'react';

// Comprehensive destination images from Unsplash for cities and countries worldwide
const destinationImageMap: Record<string, string[]> = {
  // ==================== ASIA ====================
  // East Asia
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
  'kyoto': [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=800&h=600&fit=crop',
  ],
  'osaka': [
    'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556906918-c3071bd80d68?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?w=800&h=600&fit=crop',
  ],
  'japan': [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&h=600&fit=crop',
  ],
  'seoul': [
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546874177-9e664107314e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=600&fit=crop',
  ],
  'south korea': [
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546874177-9e664107314e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=600&fit=crop',
  ],
  'korea': [
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546874177-9e664107314e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=600&fit=crop',
  ],
  'busan': [
    'https://images.unsplash.com/photo-1596507458125-0ad6d4a5e0e0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583264924902-1ae56e01cbaa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578037571214-25e07ed4a935?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1597309274715-6eb2b7c3f9c4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1596094752025-4a5ba52fdf91?w=800&h=600&fit=crop',
  ],
  'beijing': [
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584450056447-5c4a83a0d900?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529921879218-f99546d03a50?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537410862435-90f3e2b3f0d9?w=800&h=600&fit=crop',
  ],
  'shanghai': [
    'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506158669146-619067407289?w=800&h=600&fit=crop',
  ],
  'china': [
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537410862435-90f3e2b3f0d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=600&fit=crop',
  ],
  'taipei': [
    'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553701879-4c7c7e9e5836?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518599807935-37015b9cefcb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566198602178-f0c63dc73ba0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529542525389-27ef520f5e13?w=800&h=600&fit=crop',
  ],
  'taiwan': [
    'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553701879-4c7c7e9e5836?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518599807935-37015b9cefcb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566198602178-f0c63dc73ba0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529542525389-27ef520f5e13?w=800&h=600&fit=crop',
  ],
  'macau': [
    'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558976825-6b1b03a03719?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544985361-b420d7a77043?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582649475023-98f7eb36c66c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540792118236-4e29d4a756a6?w=800&h=600&fit=crop',
  ],

  // Southeast Asia
  'singapore': [
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496939376851-89342e90adcd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541631432-1e2e6f04d72e?w=800&h=600&fit=crop',
  ],
  'bangkok': [
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583334648584-6a22403f8a8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&h=600&fit=crop',
  ],
  'phuket': [
    'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&h=600&fit=crop',
  ],
  'chiang mai': [
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598111397960-2af95ae0298e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1569010276203-44c0bc4e8d48?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&h=600&fit=crop',
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
  'jakarta': [
    'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546817372-628669db4655?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586016413664-864c0dd76f53?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570436733940-a13f2b1410cb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&h=600&fit=crop',
  ],
  'indonesia': [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&h=600&fit=crop',
  ],
  'kuala lumpur': [
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1508062878650-88b52897f298?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573065353689-6ac60a3bd5dc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582467029665-d4b0775057de?w=800&h=600&fit=crop',
  ],
  'malaysia': [
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1508062878650-88b52897f298?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573065353689-6ac60a3bd5dc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582467029665-d4b0775057de?w=800&h=600&fit=crop',
  ],
  'vietnam': [
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
  ],
  'hanoi': [
    'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
  ],
  'ho chi minh': [
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&h=600&fit=crop',
  ],
  'philippines': [
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=600&fit=crop',
  ],
  'manila': [
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549051579-bc99f6f46c34?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=600&fit=crop',
  ],
  'cambodia': [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583162061555-7a6c1d6b70e5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1597741119214-0b76b7e36b6a?w=800&h=600&fit=crop',
  ],
  'siem reap': [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583162061555-7a6c1d6b70e5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1597741119214-0b76b7e36b6a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
  ],
  'myanmar': [
    'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
  ],
  'laos': [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=800&h=600&fit=crop',
  ],

  // South Asia
  'maldives': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],
  'sri lanka': [
    'https://images.unsplash.com/photo-1586016413664-864c0dd76f53?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580674571988-0b045cda0d21?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566296314540-cf85f0ea7895?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
  ],
  'nepal': [
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558799401-1dcba79f0fac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562462181-b228e3cff9ad?w=800&h=600&fit=crop',
  ],
  'kathmandu': [
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558799401-1dcba79f0fac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562462181-b228e3cff9ad?w=800&h=600&fit=crop',
  ],
  'bhutan': [
    'https://images.unsplash.com/photo-1553856622-d1b98e8eb8b9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558799401-1dcba79f0fac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&h=600&fit=crop',
  ],
  'bangladesh': [
    'https://images.unsplash.com/photo-1558799401-1dcba79f0fac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562462181-b228e3cff9ad?w=800&h=600&fit=crop',
  ],

  // Middle East
  'dubai': [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533395427226-788cee25cc7b?w=800&h=600&fit=crop',
  ],
  'abu dhabi': [
    'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
  ],
  'uae': [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533395427226-788cee25cc7b?w=800&h=600&fit=crop',
  ],
  'saudi arabia': [
    'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580974852861-c381510bc98a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
  ],
  'qatar': [
    'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533395427226-788cee25cc7b?w=800&h=600&fit=crop',
  ],
  'doha': [
    'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533395427226-788cee25cc7b?w=800&h=600&fit=crop',
  ],
  'oman': [
    'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533395427226-788cee25cc7b?w=800&h=600&fit=crop',
  ],
  'jordan': [
    'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579033462043-0f11a7862f7d?w=800&h=600&fit=crop',
  ],
  'petra': [
    'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579033462043-0f11a7862f7d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=600&fit=crop',
  ],
  'israel': [
    'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552423310-ba74b8de8c7d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531152127291-ea24f3e5aee3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&h=600&fit=crop',
  ],
  'turkey': [
    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558383817-8cf94d354ebd?w=800&h=600&fit=crop',
  ],
  'istanbul': [
    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558383817-8cf94d354ebd?w=800&h=600&fit=crop',
  ],
  'cappadocia': [
    'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558383817-8cf94d354ebd?w=800&h=600&fit=crop',
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
  'jaipur': [
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&h=600&fit=crop',
  ],
  'udaipur': [
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
  ],
  'delhi': [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=800&h=600&fit=crop',
  ],
  'new delhi': [
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
  'bangalore': [
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&h=600&fit=crop',
  ],
  'bengaluru': [
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&h=600&fit=crop',
  ],
  'chennai': [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&h=600&fit=crop',
  ],
  'hyderabad': [
    'https://images.unsplash.com/photo-1572445271230-a78b4972c6d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&h=600&fit=crop',
  ],
  'kolkata': [
    'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&h=600&fit=crop',
  ],
  'agra': [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=800&h=600&fit=crop',
  ],
  'varanasi': [
    'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=800&h=600&fit=crop',
  ],
  'shimla': [
    'https://images.unsplash.com/photo-1597074866923-dc0589150f59?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
  ],
  'manali': [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1597074866923-dc0589150f59?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
  ],
  'leh ladakh': [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1597074866923-dc0589150f59?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
  ],
  'ladakh': [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1597074866923-dc0589150f59?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
  ],
  'rishikesh': [
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558799401-1dcba79f0fac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562462181-b228e3cff9ad?w=800&h=600&fit=crop',
  ],
  'darjeeling': [
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558799401-1dcba79f0fac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562462181-b228e3cff9ad?w=800&h=600&fit=crop',
  ],
  'andaman': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],
  'india': [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=800&h=600&fit=crop',
  ],

  // ==================== EUROPE ====================
  // Western Europe
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
  'nice': [
    'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
  ],
  'london': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529180184525-78f99adb8e98?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&h=600&fit=crop',
  ],
  'united kingdom': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529180184525-78f99adb8e98?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&h=600&fit=crop',
  ],
  'uk': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529180184525-78f99adb8e98?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&h=600&fit=crop',
  ],
  'england': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529180184525-78f99adb8e98?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&h=600&fit=crop',
  ],
  'scotland': [
    'https://images.unsplash.com/photo-1566936737687-8f392a237b8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529180184525-78f99adb8e98?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=600&fit=crop',
  ],
  'edinburgh': [
    'https://images.unsplash.com/photo-1566936737687-8f392a237b8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529180184525-78f99adb8e98?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=600&fit=crop',
  ],
  'amsterdam': [
    'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576924542622-772281b13aa8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800&h=600&fit=crop',
  ],
  'netherlands': [
    'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576924542622-772281b13aa8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800&h=600&fit=crop',
  ],
  'belgium': [
    'https://images.unsplash.com/photo-1559113513-d5e09c78b9dd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576924542622-772281b13aa8?w=800&h=600&fit=crop',
  ],
  'brussels': [
    'https://images.unsplash.com/photo-1559113513-d5e09c78b9dd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576924542622-772281b13aa8?w=800&h=600&fit=crop',
  ],
  'germany': [
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1554072675-66db59dba46f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=600&fit=crop',
  ],
  'berlin': [
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1554072675-66db59dba46f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop',
  ],
  'munich': [
    'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1554072675-66db59dba46f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=600&fit=crop',
  ],

  // Southern Europe
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
  'venice': [
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?w=800&h=600&fit=crop',
  ],
  'florence': [
    'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?w=800&h=600&fit=crop',
  ],
  'milan': [
    'https://images.unsplash.com/photo-1520440229-6469a149ac59?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?w=800&h=600&fit=crop',
  ],
  'amalfi': [
    'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?w=800&h=600&fit=crop',
  ],
  'barcelona': [
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579282240050-352db0a14c21?w=800&h=600&fit=crop',
  ],
  'spain': [
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579282240050-352db0a14c21?w=800&h=600&fit=crop',
  ],
  'madrid': [
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558370781-d6196949e317?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579282240050-352db0a14c21?w=800&h=600&fit=crop',
  ],
  'portugal': [
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513735492246-483525079686?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558370781-d6196949e317?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
  ],
  'lisbon': [
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513735492246-483525079686?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558370781-d6196949e317?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
  ],
  'greece': [
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop',
  ],
  'santorini': [
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop',
  ],
  'athens': [
    'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
  ],
  'croatia': [
    'https://images.unsplash.com/photo-1555990538-1e7c84a79eee?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&h=600&fit=crop',
  ],
  'dubrovnik': [
    'https://images.unsplash.com/photo-1555990538-1e7c84a79eee?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&h=600&fit=crop',
  ],

  // Central Europe
  'switzerland': [
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?w=800&h=600&fit=crop',
  ],
  'zurich': [
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?w=800&h=600&fit=crop',
  ],
  'austria': [
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
  ],
  'vienna': [
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  ],
  'prague': [
    'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&h=600&fit=crop',
  ],
  'czech republic': [
    'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&h=600&fit=crop',
  ],
  'hungary': [
    'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?w=800&h=600&fit=crop',
  ],
  'budapest': [
    'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?w=800&h=600&fit=crop',
  ],
  'poland': [
    'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?w=800&h=600&fit=crop',
  ],

  // Scandinavia
  'norway': [
    'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516496636080-14fb876e029d?w=800&h=600&fit=crop',
  ],
  'sweden': [
    'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop',
  ],
  'stockholm': [
    'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop',
  ],
  'denmark': [
    'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&h=600&fit=crop',
  ],
  'copenhagen': [
    'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&h=600&fit=crop',
  ],
  'finland': [
    'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
  ],
  'iceland': [
    'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=600&fit=crop',
  ],
  'reykjavik': [
    'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=600&fit=crop',
  ],
  'russia': [
    'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=600&fit=crop',
  ],
  'moscow': [
    'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=600&fit=crop',
  ],

  // ==================== AMERICAS ====================
  // North America
  'new york': [
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=800&h=600&fit=crop',
  ],
  'new york city': [
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=800&h=600&fit=crop',
  ],
  'nyc': [
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=800&h=600&fit=crop',
  ],
  'los angeles': [
    'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
  ],
  'la': [
    'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
  ],
  'san francisco': [
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  ],
  'las vegas': [
    'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  ],
  'miami': [
    'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  ],
  'chicago': [
    'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  ],
  'hawaii': [
    'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800&h=600&fit=crop',
  ],
  'usa': [
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1476391907330-c39d0268a362?w=800&h=600&fit=crop',
  ],
  'united states': [
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1476391907330-c39d0268a362?w=800&h=600&fit=crop',
  ],
  'america': [
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1476391907330-c39d0268a362?w=800&h=600&fit=crop',
  ],
  'canada': [
    'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&h=600&fit=crop',
  ],
  'toronto': [
    'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&h=600&fit=crop',
  ],
  'vancouver': [
    'https://images.unsplash.com/photo-1559511260-66a68e7e3fca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop',
  ],
  'mexico': [
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559511260-66a68e7e3fca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&h=600&fit=crop',
  ],
  'cancun': [
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559511260-66a68e7e3fca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&h=600&fit=crop',
  ],
  'mexico city': [
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559511260-66a68e7e3fca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&h=600&fit=crop',
  ],

  // South America
  'brazil': [
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559511260-66a68e7e3fca?w=800&h=600&fit=crop',
  ],
  'rio de janeiro': [
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559511260-66a68e7e3fca?w=800&h=600&fit=crop',
  ],
  'argentina': [
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559511260-66a68e7e3fca?w=800&h=600&fit=crop',
  ],
  'buenos aires': [
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559511260-66a68e7e3fca?w=800&h=600&fit=crop',
  ],
  'peru': [
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
  ],
  'machu picchu': [
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
  ],
  'chile': [
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
  ],
  'colombia': [
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
  ],

  // Caribbean
  'caribbean': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],
  'bahamas': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],
  'jamaica': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],
  'cuba': [
    'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
  ],

  // ==================== OCEANIA ====================
  'sydney': [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524820197278-540916411e20?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526995003517-7ae53e6b6b2d?w=800&h=600&fit=crop',
  ],
  'melbourne': [
    'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524820197278-540916411e20?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&h=600&fit=crop',
  ],
  'australia': [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513395295099-0b4e8d488b72?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494233892892-84542a694e72?w=800&h=600&fit=crop',
  ],
  'new zealand': [
    'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop',
  ],
  'auckland': [
    'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop',
  ],
  'queenstown': [
    'https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop',
  ],
  'fiji': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],
  'tahiti': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],

  // ==================== AFRICA ====================
  'south africa': [
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
  ],
  'cape town': [
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
  ],
  'kenya': [
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
  ],
  'tanzania': [
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
  ],
  'morocco': [
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&h=600&fit=crop',
  ],
  'marrakech': [
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=800&h=600&fit=crop',
  ],
  'egypt': [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop',
  ],
  'cairo': [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop',
  ],
  'mauritius': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],
  'seychelles': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
  ],
  'zanzibar': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&h=600&fit=crop',
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
