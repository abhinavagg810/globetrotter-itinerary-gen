import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const popularDestinations = [
  // Asia - India
  { name: "Mumbai", location: "Maharashtra, India", type: "City", rating: 4.5 },
  { name: "Delhi", location: "India", type: "City", rating: 4.2 },
  { name: "New Delhi", location: "India", type: "City", rating: 4.3 },
  { name: "Bangalore", location: "Karnataka, India", type: "City", rating: 4.3 },
  { name: "Bengaluru", location: "Karnataka, India", type: "City", rating: 4.3 },
  { name: "Chennai", location: "Tamil Nadu, India", type: "City", rating: 4.2 },
  { name: "Kolkata", location: "West Bengal, India", type: "City", rating: 4.2 },
  { name: "Hyderabad", location: "Telangana, India", type: "City", rating: 4.3 },
  { name: "Pune", location: "Maharashtra, India", type: "City", rating: 4.2 },
  { name: "Ahmedabad", location: "Gujarat, India", type: "City", rating: 4.1 },
  { name: "Jaipur", location: "Rajasthan, India", type: "City", rating: 4.5 },
  { name: "Goa", location: "India", type: "State", rating: 4.7 },
  { name: "Udaipur", location: "Rajasthan, India", type: "City", rating: 4.6 },
  { name: "Jodhpur", location: "Rajasthan, India", type: "City", rating: 4.4 },
  { name: "Agra", location: "Uttar Pradesh, India", type: "City", rating: 4.5 },
  { name: "Varanasi", location: "Uttar Pradesh, India", type: "City", rating: 4.4 },
  { name: "Rishikesh", location: "Uttarakhand, India", type: "City", rating: 4.5 },
  { name: "Manali", location: "Himachal Pradesh, India", type: "City", rating: 4.6 },
  { name: "Shimla", location: "Himachal Pradesh, India", type: "City", rating: 4.4 },
  { name: "Dharamshala", location: "Himachal Pradesh, India", type: "City", rating: 4.5 },
  { name: "Leh", location: "Ladakh, India", type: "City", rating: 4.7 },
  { name: "Ladakh", location: "India", type: "Region", rating: 4.8 },
  { name: "Kerala", location: "India", type: "State", rating: 4.7 },
  { name: "Kochi", location: "Kerala, India", type: "City", rating: 4.4 },
  { name: "Munnar", location: "Kerala, India", type: "City", rating: 4.6 },
  { name: "Alleppey", location: "Kerala, India", type: "City", rating: 4.5 },
  { name: "Ooty", location: "Tamil Nadu, India", type: "City", rating: 4.4 },
  { name: "Mysore", location: "Karnataka, India", type: "City", rating: 4.4 },
  { name: "Hampi", location: "Karnataka, India", type: "City", rating: 4.5 },
  { name: "Darjeeling", location: "West Bengal, India", type: "City", rating: 4.5 },
  { name: "Gangtok", location: "Sikkim, India", type: "City", rating: 4.5 },
  { name: "Andaman Islands", location: "India", type: "Island", rating: 4.7 },
  { name: "Srinagar", location: "Kashmir, India", type: "City", rating: 4.6 },
  { name: "Amritsar", location: "Punjab, India", type: "City", rating: 4.5 },
  { name: "Lucknow", location: "Uttar Pradesh, India", type: "City", rating: 4.2 },
  { name: "Chandigarh", location: "India", type: "City", rating: 4.2 },
  { name: "Jaisalmer", location: "Rajasthan, India", type: "City", rating: 4.5 },
  { name: "Pushkar", location: "Rajasthan, India", type: "City", rating: 4.4 },
  { name: "Mount Abu", location: "Rajasthan, India", type: "City", rating: 4.3 },
  { name: "Coorg", location: "Karnataka, India", type: "City", rating: 4.5 },
  { name: "Pondicherry", location: "India", type: "City", rating: 4.4 },
  { name: "Mahabalipuram", location: "Tamil Nadu, India", type: "City", rating: 4.4 },
  { name: "Khajuraho", location: "Madhya Pradesh, India", type: "City", rating: 4.4 },
  { name: "Bhopal", location: "Madhya Pradesh, India", type: "City", rating: 4.1 },
  { name: "Indore", location: "Madhya Pradesh, India", type: "City", rating: 4.1 },
  { name: "Surat", location: "Gujarat, India", type: "City", rating: 4.0 },
  { name: "Vadodara", location: "Gujarat, India", type: "City", rating: 4.1 },
  { name: "Nagpur", location: "Maharashtra, India", type: "City", rating: 4.0 },
  { name: "Aurangabad", location: "Maharashtra, India", type: "City", rating: 4.2 },
  { name: "Nashik", location: "Maharashtra, India", type: "City", rating: 4.1 },
  { name: "Lonavala", location: "Maharashtra, India", type: "City", rating: 4.3 },
  { name: "Mahabaleshwar", location: "Maharashtra, India", type: "City", rating: 4.4 },
  { name: "Shirdi", location: "Maharashtra, India", type: "City", rating: 4.3 },
  { name: "Tirupati", location: "Andhra Pradesh, India", type: "City", rating: 4.4 },
  { name: "Visakhapatnam", location: "Andhra Pradesh, India", type: "City", rating: 4.2 },
  { name: "Madurai", location: "Tamil Nadu, India", type: "City", rating: 4.3 },
  { name: "Coimbatore", location: "Tamil Nadu, India", type: "City", rating: 4.1 },
  { name: "Trivandrum", location: "Kerala, India", type: "City", rating: 4.2 },
  { name: "Guwahati", location: "Assam, India", type: "City", rating: 4.1 },
  { name: "Shillong", location: "Meghalaya, India", type: "City", rating: 4.4 },
  { name: "Kaziranga", location: "Assam, India", type: "Park", rating: 4.5 },
  { name: "Jim Corbett", location: "Uttarakhand, India", type: "Park", rating: 4.4 },
  { name: "Ranthambore", location: "Rajasthan, India", type: "Park", rating: 4.5 },

  // Asia - Thailand
  { name: "Thailand", location: "Southeast Asia", type: "Country", rating: 4.6 },
  { name: "Bangkok", location: "Thailand", type: "City", rating: 4.4 },
  { name: "Phuket", location: "Thailand", type: "Island", rating: 4.6 },
  { name: "Chiang Mai", location: "Thailand", type: "City", rating: 4.5 },
  { name: "Pattaya", location: "Thailand", type: "City", rating: 4.2 },
  { name: "Krabi", location: "Thailand", type: "City", rating: 4.6 },
  { name: "Koh Samui", location: "Thailand", type: "Island", rating: 4.5 },
  { name: "Koh Phi Phi", location: "Thailand", type: "Island", rating: 4.6 },
  { name: "Koh Tao", location: "Thailand", type: "Island", rating: 4.5 },
  { name: "Koh Lanta", location: "Thailand", type: "Island", rating: 4.4 },
  { name: "Hua Hin", location: "Thailand", type: "City", rating: 4.3 },
  { name: "Chiang Rai", location: "Thailand", type: "City", rating: 4.4 },
  { name: "Ayutthaya", location: "Thailand", type: "City", rating: 4.4 },
  { name: "Kanchanaburi", location: "Thailand", type: "City", rating: 4.3 },
  { name: "Pai", location: "Thailand", type: "City", rating: 4.4 },

  // Asia - Other Southeast Asian Countries
  { name: "Vietnam", location: "Southeast Asia", type: "Country", rating: 4.5 },
  { name: "Ho Chi Minh City", location: "Vietnam", type: "City", rating: 4.4 },
  { name: "Hanoi", location: "Vietnam", type: "City", rating: 4.4 },
  { name: "Da Nang", location: "Vietnam", type: "City", rating: 4.5 },
  { name: "Hoi An", location: "Vietnam", type: "City", rating: 4.6 },
  { name: "Nha Trang", location: "Vietnam", type: "City", rating: 4.4 },
  { name: "Phu Quoc", location: "Vietnam", type: "Island", rating: 4.5 },
  { name: "Ha Long Bay", location: "Vietnam", type: "Region", rating: 4.7 },
  { name: "Sapa", location: "Vietnam", type: "City", rating: 4.5 },
  { name: "Hue", location: "Vietnam", type: "City", rating: 4.4 },
  { name: "Dalat", location: "Vietnam", type: "City", rating: 4.4 },

  { name: "Indonesia", location: "Southeast Asia", type: "Country", rating: 4.5 },
  { name: "Bali", location: "Indonesia", type: "Island", rating: 4.9 },
  { name: "Jakarta", location: "Indonesia", type: "City", rating: 4.1 },
  { name: "Yogyakarta", location: "Indonesia", type: "City", rating: 4.5 },
  { name: "Ubud", location: "Bali, Indonesia", type: "City", rating: 4.7 },
  { name: "Seminyak", location: "Bali, Indonesia", type: "City", rating: 4.5 },
  { name: "Kuta", location: "Bali, Indonesia", type: "City", rating: 4.3 },
  { name: "Nusa Dua", location: "Bali, Indonesia", type: "City", rating: 4.5 },
  { name: "Lombok", location: "Indonesia", type: "Island", rating: 4.5 },
  { name: "Gili Islands", location: "Indonesia", type: "Island", rating: 4.6 },
  { name: "Komodo Island", location: "Indonesia", type: "Island", rating: 4.7 },
  { name: "Raja Ampat", location: "Indonesia", type: "Island", rating: 4.8 },
  { name: "Bandung", location: "Indonesia", type: "City", rating: 4.2 },
  { name: "Surabaya", location: "Indonesia", type: "City", rating: 4.1 },

  { name: "Malaysia", location: "Southeast Asia", type: "Country", rating: 4.4 },
  { name: "Kuala Lumpur", location: "Malaysia", type: "City", rating: 4.4 },
  { name: "Penang", location: "Malaysia", type: "Island", rating: 4.5 },
  { name: "Langkawi", location: "Malaysia", type: "Island", rating: 4.6 },
  { name: "Malacca", location: "Malaysia", type: "City", rating: 4.4 },
  { name: "Cameron Highlands", location: "Malaysia", type: "Region", rating: 4.3 },
  { name: "Kota Kinabalu", location: "Malaysia", type: "City", rating: 4.4 },
  { name: "Borneo", location: "Malaysia", type: "Island", rating: 4.6 },
  { name: "Ipoh", location: "Malaysia", type: "City", rating: 4.2 },
  { name: "Johor Bahru", location: "Malaysia", type: "City", rating: 4.1 },
  { name: "Tioman Island", location: "Malaysia", type: "Island", rating: 4.4 },
  { name: "Redang Island", location: "Malaysia", type: "Island", rating: 4.5 },

  { name: "Singapore", location: "Southeast Asia", type: "Country", rating: 4.6 },

  { name: "Philippines", location: "Southeast Asia", type: "Country", rating: 4.5 },
  { name: "Manila", location: "Philippines", type: "City", rating: 4.1 },
  { name: "Cebu", location: "Philippines", type: "City", rating: 4.4 },
  { name: "Boracay", location: "Philippines", type: "Island", rating: 4.7 },
  { name: "Palawan", location: "Philippines", type: "Island", rating: 4.8 },
  { name: "El Nido", location: "Palawan, Philippines", type: "City", rating: 4.7 },
  { name: "Coron", location: "Palawan, Philippines", type: "City", rating: 4.6 },
  { name: "Bohol", location: "Philippines", type: "Island", rating: 4.5 },
  { name: "Siargao", location: "Philippines", type: "Island", rating: 4.6 },
  { name: "Baguio", location: "Philippines", type: "City", rating: 4.3 },

  { name: "Cambodia", location: "Southeast Asia", type: "Country", rating: 4.4 },
  { name: "Siem Reap", location: "Cambodia", type: "City", rating: 4.6 },
  { name: "Angkor Wat", location: "Cambodia", type: "Landmark", rating: 4.8 },
  { name: "Phnom Penh", location: "Cambodia", type: "City", rating: 4.2 },
  { name: "Sihanoukville", location: "Cambodia", type: "City", rating: 4.1 },
  { name: "Koh Rong", location: "Cambodia", type: "Island", rating: 4.4 },

  { name: "Laos", location: "Southeast Asia", type: "Country", rating: 4.3 },
  { name: "Luang Prabang", location: "Laos", type: "City", rating: 4.6 },
  { name: "Vientiane", location: "Laos", type: "City", rating: 4.2 },
  { name: "Vang Vieng", location: "Laos", type: "City", rating: 4.3 },

  { name: "Myanmar", location: "Southeast Asia", type: "Country", rating: 4.3 },
  { name: "Bagan", location: "Myanmar", type: "City", rating: 4.7 },
  { name: "Yangon", location: "Myanmar", type: "City", rating: 4.2 },
  { name: "Mandalay", location: "Myanmar", type: "City", rating: 4.3 },
  { name: "Inle Lake", location: "Myanmar", type: "Region", rating: 4.5 },

  // Asia - East Asia
  { name: "Japan", location: "East Asia", type: "Country", rating: 4.8 },
  { name: "Tokyo", location: "Japan", type: "City", rating: 4.7 },
  { name: "Kyoto", location: "Japan", type: "City", rating: 4.8 },
  { name: "Osaka", location: "Japan", type: "City", rating: 4.6 },
  { name: "Hiroshima", location: "Japan", type: "City", rating: 4.5 },
  { name: "Nara", location: "Japan", type: "City", rating: 4.5 },
  { name: "Hakone", location: "Japan", type: "City", rating: 4.5 },
  { name: "Mount Fuji", location: "Japan", type: "Landmark", rating: 4.7 },
  { name: "Nikko", location: "Japan", type: "City", rating: 4.5 },
  { name: "Kanazawa", location: "Japan", type: "City", rating: 4.5 },
  { name: "Nagoya", location: "Japan", type: "City", rating: 4.3 },
  { name: "Fukuoka", location: "Japan", type: "City", rating: 4.4 },
  { name: "Sapporo", location: "Japan", type: "City", rating: 4.5 },
  { name: "Okinawa", location: "Japan", type: "Island", rating: 4.6 },
  { name: "Kamakura", location: "Japan", type: "City", rating: 4.5 },
  { name: "Kobe", location: "Japan", type: "City", rating: 4.4 },

  { name: "South Korea", location: "East Asia", type: "Country", rating: 4.5 },
  { name: "Seoul", location: "South Korea", type: "City", rating: 4.5 },
  { name: "Busan", location: "South Korea", type: "City", rating: 4.5 },
  { name: "Jeju Island", location: "South Korea", type: "Island", rating: 4.6 },
  { name: "Gyeongju", location: "South Korea", type: "City", rating: 4.4 },
  { name: "Incheon", location: "South Korea", type: "City", rating: 4.2 },

  { name: "China", location: "East Asia", type: "Country", rating: 4.4 },
  { name: "Beijing", location: "China", type: "City", rating: 4.5 },
  { name: "Shanghai", location: "China", type: "City", rating: 4.5 },
  { name: "Hong Kong", location: "China", type: "City", rating: 4.5 },
  { name: "Macau", location: "China", type: "City", rating: 4.4 },
  { name: "Shenzhen", location: "China", type: "City", rating: 4.2 },
  { name: "Guangzhou", location: "China", type: "City", rating: 4.2 },
  { name: "Xi'an", location: "China", type: "City", rating: 4.5 },
  { name: "Chengdu", location: "China", type: "City", rating: 4.4 },
  { name: "Guilin", location: "China", type: "City", rating: 4.5 },
  { name: "Hangzhou", location: "China", type: "City", rating: 4.4 },
  { name: "Suzhou", location: "China", type: "City", rating: 4.3 },
  { name: "Zhangjiajie", location: "China", type: "City", rating: 4.6 },
  { name: "Lijiang", location: "China", type: "City", rating: 4.5 },
  { name: "Tibet", location: "China", type: "Region", rating: 4.6 },
  { name: "Lhasa", location: "Tibet, China", type: "City", rating: 4.5 },
  { name: "Great Wall of China", location: "China", type: "Landmark", rating: 4.8 },

  { name: "Taiwan", location: "East Asia", type: "Country", rating: 4.5 },
  { name: "Taipei", location: "Taiwan", type: "City", rating: 4.5 },
  { name: "Kaohsiung", location: "Taiwan", type: "City", rating: 4.3 },
  { name: "Taichung", location: "Taiwan", type: "City", rating: 4.3 },
  { name: "Sun Moon Lake", location: "Taiwan", type: "Region", rating: 4.5 },
  { name: "Jiufen", location: "Taiwan", type: "City", rating: 4.4 },
  { name: "Taroko Gorge", location: "Taiwan", type: "Park", rating: 4.6 },

  // Asia - South Asia
  { name: "Sri Lanka", location: "South Asia", type: "Country", rating: 4.6 },
  { name: "Colombo", location: "Sri Lanka", type: "City", rating: 4.2 },
  { name: "Kandy", location: "Sri Lanka", type: "City", rating: 4.5 },
  { name: "Galle", location: "Sri Lanka", type: "City", rating: 4.5 },
  { name: "Ella", location: "Sri Lanka", type: "City", rating: 4.6 },
  { name: "Sigiriya", location: "Sri Lanka", type: "Landmark", rating: 4.7 },
  { name: "Mirissa", location: "Sri Lanka", type: "City", rating: 4.5 },
  { name: "Nuwara Eliya", location: "Sri Lanka", type: "City", rating: 4.4 },
  { name: "Bentota", location: "Sri Lanka", type: "City", rating: 4.4 },
  { name: "Trincomalee", location: "Sri Lanka", type: "City", rating: 4.4 },

  { name: "Nepal", location: "South Asia", type: "Country", rating: 4.5 },
  { name: "Kathmandu", location: "Nepal", type: "City", rating: 4.4 },
  { name: "Pokhara", location: "Nepal", type: "City", rating: 4.6 },
  { name: "Everest Base Camp", location: "Nepal", type: "Landmark", rating: 4.8 },
  { name: "Chitwan", location: "Nepal", type: "Park", rating: 4.5 },
  { name: "Lumbini", location: "Nepal", type: "City", rating: 4.4 },
  { name: "Nagarkot", location: "Nepal", type: "City", rating: 4.4 },

  { name: "Bhutan", location: "South Asia", type: "Country", rating: 4.7 },
  { name: "Thimphu", location: "Bhutan", type: "City", rating: 4.5 },
  { name: "Paro", location: "Bhutan", type: "City", rating: 4.6 },
  { name: "Tiger's Nest", location: "Bhutan", type: "Landmark", rating: 4.8 },

  { name: "Bangladesh", location: "South Asia", type: "Country", rating: 4.1 },
  { name: "Dhaka", location: "Bangladesh", type: "City", rating: 4.0 },
  { name: "Cox's Bazar", location: "Bangladesh", type: "City", rating: 4.3 },
  { name: "Sundarbans", location: "Bangladesh", type: "Park", rating: 4.4 },

  { name: "Pakistan", location: "South Asia", type: "Country", rating: 4.2 },
  { name: "Lahore", location: "Pakistan", type: "City", rating: 4.3 },
  { name: "Islamabad", location: "Pakistan", type: "City", rating: 4.2 },
  { name: "Karachi", location: "Pakistan", type: "City", rating: 4.0 },
  { name: "Hunza Valley", location: "Pakistan", type: "Region", rating: 4.7 },
  { name: "Skardu", location: "Pakistan", type: "City", rating: 4.6 },

  // Asia - Middle East
  { name: "United Arab Emirates", location: "Middle East", type: "Country", rating: 4.6 },
  { name: "UAE", location: "Middle East", type: "Country", rating: 4.6 },
  { name: "Dubai", location: "UAE", type: "City", rating: 4.8 },
  { name: "Abu Dhabi", location: "UAE", type: "City", rating: 4.6 },
  { name: "Sharjah", location: "UAE", type: "City", rating: 4.2 },
  { name: "Ras Al Khaimah", location: "UAE", type: "City", rating: 4.3 },
  { name: "Fujairah", location: "UAE", type: "City", rating: 4.2 },

  { name: "Saudi Arabia", location: "Middle East", type: "Country", rating: 4.3 },
  { name: "Riyadh", location: "Saudi Arabia", type: "City", rating: 4.2 },
  { name: "Jeddah", location: "Saudi Arabia", type: "City", rating: 4.3 },
  { name: "Mecca", location: "Saudi Arabia", type: "City", rating: 4.7 },
  { name: "Medina", location: "Saudi Arabia", type: "City", rating: 4.6 },
  { name: "AlUla", location: "Saudi Arabia", type: "City", rating: 4.6 },
  { name: "NEOM", location: "Saudi Arabia", type: "Region", rating: 4.5 },

  { name: "Qatar", location: "Middle East", type: "Country", rating: 4.4 },
  { name: "Doha", location: "Qatar", type: "City", rating: 4.5 },

  { name: "Bahrain", location: "Middle East", type: "Country", rating: 4.2 },
  { name: "Manama", location: "Bahrain", type: "City", rating: 4.2 },

  { name: "Oman", location: "Middle East", type: "Country", rating: 4.5 },
  { name: "Muscat", location: "Oman", type: "City", rating: 4.5 },
  { name: "Salalah", location: "Oman", type: "City", rating: 4.4 },

  { name: "Kuwait", location: "Middle East", type: "Country", rating: 4.1 },
  { name: "Kuwait City", location: "Kuwait", type: "City", rating: 4.1 },

  { name: "Jordan", location: "Middle East", type: "Country", rating: 4.5 },
  { name: "Amman", location: "Jordan", type: "City", rating: 4.3 },
  { name: "Petra", location: "Jordan", type: "Landmark", rating: 4.8 },
  { name: "Dead Sea", location: "Jordan", type: "Region", rating: 4.6 },
  { name: "Wadi Rum", location: "Jordan", type: "Region", rating: 4.7 },
  { name: "Aqaba", location: "Jordan", type: "City", rating: 4.4 },

  { name: "Israel", location: "Middle East", type: "Country", rating: 4.4 },
  { name: "Tel Aviv", location: "Israel", type: "City", rating: 4.5 },
  { name: "Jerusalem", location: "Israel", type: "City", rating: 4.6 },
  { name: "Haifa", location: "Israel", type: "City", rating: 4.3 },
  { name: "Eilat", location: "Israel", type: "City", rating: 4.4 },

  { name: "Lebanon", location: "Middle East", type: "Country", rating: 4.3 },
  { name: "Beirut", location: "Lebanon", type: "City", rating: 4.3 },

  { name: "Turkey", location: "Middle East/Europe", type: "Country", rating: 4.6 },
  { name: "Istanbul", location: "Turkey", type: "City", rating: 4.7 },
  { name: "Cappadocia", location: "Turkey", type: "Region", rating: 4.8 },
  { name: "Antalya", location: "Turkey", type: "City", rating: 4.5 },
  { name: "Bodrum", location: "Turkey", type: "City", rating: 4.4 },
  { name: "Izmir", location: "Turkey", type: "City", rating: 4.3 },
  { name: "Pamukkale", location: "Turkey", type: "Landmark", rating: 4.6 },
  { name: "Ephesus", location: "Turkey", type: "Landmark", rating: 4.6 },
  { name: "Fethiye", location: "Turkey", type: "City", rating: 4.5 },
  { name: "Marmaris", location: "Turkey", type: "City", rating: 4.3 },
  { name: "Ankara", location: "Turkey", type: "City", rating: 4.1 },

  // Europe - Western Europe
  { name: "United Kingdom", location: "Western Europe", type: "Country", rating: 4.5 },
  { name: "UK", location: "Western Europe", type: "Country", rating: 4.5 },
  { name: "England", location: "United Kingdom", type: "Country", rating: 4.5 },
  { name: "London", location: "United Kingdom", type: "City", rating: 4.5 },
  { name: "Manchester", location: "United Kingdom", type: "City", rating: 4.3 },
  { name: "Edinburgh", location: "Scotland, UK", type: "City", rating: 4.6 },
  { name: "Scotland", location: "United Kingdom", type: "Country", rating: 4.6 },
  { name: "Glasgow", location: "Scotland, UK", type: "City", rating: 4.3 },
  { name: "Liverpool", location: "United Kingdom", type: "City", rating: 4.3 },
  { name: "Birmingham", location: "United Kingdom", type: "City", rating: 4.1 },
  { name: "Oxford", location: "United Kingdom", type: "City", rating: 4.5 },
  { name: "Cambridge", location: "United Kingdom", type: "City", rating: 4.5 },
  { name: "Bath", location: "United Kingdom", type: "City", rating: 4.5 },
  { name: "York", location: "United Kingdom", type: "City", rating: 4.4 },
  { name: "Brighton", location: "United Kingdom", type: "City", rating: 4.3 },
  { name: "Cornwall", location: "United Kingdom", type: "Region", rating: 4.5 },
  { name: "Lake District", location: "United Kingdom", type: "Region", rating: 4.6 },
  { name: "Cotswolds", location: "United Kingdom", type: "Region", rating: 4.5 },
  { name: "Stonehenge", location: "United Kingdom", type: "Landmark", rating: 4.4 },
  { name: "Wales", location: "United Kingdom", type: "Country", rating: 4.4 },
  { name: "Cardiff", location: "Wales, UK", type: "City", rating: 4.2 },
  { name: "Belfast", location: "Northern Ireland, UK", type: "City", rating: 4.3 },

  { name: "Ireland", location: "Western Europe", type: "Country", rating: 4.6 },
  { name: "Dublin", location: "Ireland", type: "City", rating: 4.5 },
  { name: "Galway", location: "Ireland", type: "City", rating: 4.5 },
  { name: "Cork", location: "Ireland", type: "City", rating: 4.3 },
  { name: "Cliffs of Moher", location: "Ireland", type: "Landmark", rating: 4.7 },
  { name: "Ring of Kerry", location: "Ireland", type: "Region", rating: 4.6 },

  { name: "France", location: "Western Europe", type: "Country", rating: 4.6 },
  { name: "Paris", location: "France", type: "City", rating: 4.6 },
  { name: "Nice", location: "France", type: "City", rating: 4.5 },
  { name: "Lyon", location: "France", type: "City", rating: 4.4 },
  { name: "Marseille", location: "France", type: "City", rating: 4.3 },
  { name: "Bordeaux", location: "France", type: "City", rating: 4.5 },
  { name: "Strasbourg", location: "France", type: "City", rating: 4.4 },
  { name: "Monaco", location: "Europe", type: "Country", rating: 4.6 },
  { name: "French Riviera", location: "France", type: "Region", rating: 4.7 },
  { name: "Cannes", location: "France", type: "City", rating: 4.5 },
  { name: "Saint-Tropez", location: "France", type: "City", rating: 4.5 },
  { name: "Provence", location: "France", type: "Region", rating: 4.6 },
  { name: "Loire Valley", location: "France", type: "Region", rating: 4.5 },
  { name: "Mont Saint-Michel", location: "France", type: "Landmark", rating: 4.7 },
  { name: "Normandy", location: "France", type: "Region", rating: 4.5 },
  { name: "Chamonix", location: "France", type: "City", rating: 4.6 },
  { name: "Toulouse", location: "France", type: "City", rating: 4.3 },

  { name: "Germany", location: "Western Europe", type: "Country", rating: 4.4 },
  { name: "Berlin", location: "Germany", type: "City", rating: 4.5 },
  { name: "Munich", location: "Germany", type: "City", rating: 4.5 },
  { name: "Frankfurt", location: "Germany", type: "City", rating: 4.2 },
  { name: "Hamburg", location: "Germany", type: "City", rating: 4.3 },
  { name: "Cologne", location: "Germany", type: "City", rating: 4.3 },
  { name: "Dusseldorf", location: "Germany", type: "City", rating: 4.2 },
  { name: "Bavaria", location: "Germany", type: "Region", rating: 4.6 },
  { name: "Black Forest", location: "Germany", type: "Region", rating: 4.5 },
  { name: "Neuschwanstein Castle", location: "Germany", type: "Landmark", rating: 4.7 },
  { name: "Heidelberg", location: "Germany", type: "City", rating: 4.5 },
  { name: "Dresden", location: "Germany", type: "City", rating: 4.4 },
  { name: "Rothenburg", location: "Germany", type: "City", rating: 4.5 },

  { name: "Netherlands", location: "Western Europe", type: "Country", rating: 4.5 },
  { name: "Amsterdam", location: "Netherlands", type: "City", rating: 4.4 },
  { name: "Rotterdam", location: "Netherlands", type: "City", rating: 4.3 },
  { name: "The Hague", location: "Netherlands", type: "City", rating: 4.2 },
  { name: "Utrecht", location: "Netherlands", type: "City", rating: 4.3 },

  { name: "Belgium", location: "Western Europe", type: "Country", rating: 4.4 },
  { name: "Brussels", location: "Belgium", type: "City", rating: 4.3 },
  { name: "Bruges", location: "Belgium", type: "City", rating: 4.6 },
  { name: "Ghent", location: "Belgium", type: "City", rating: 4.4 },
  { name: "Antwerp", location: "Belgium", type: "City", rating: 4.3 },

  { name: "Luxembourg", location: "Western Europe", type: "Country", rating: 4.3 },
  { name: "Luxembourg City", location: "Luxembourg", type: "City", rating: 4.3 },

  { name: "Switzerland", location: "Western Europe", type: "Country", rating: 4.8 },
  { name: "Zurich", location: "Switzerland", type: "City", rating: 4.5 },
  { name: "Geneva", location: "Switzerland", type: "City", rating: 4.5 },
  { name: "Lucerne", location: "Switzerland", type: "City", rating: 4.6 },
  { name: "Interlaken", location: "Switzerland", type: "City", rating: 4.7 },
  { name: "Zermatt", location: "Switzerland", type: "City", rating: 4.7 },
  { name: "Jungfrau", location: "Switzerland", type: "Landmark", rating: 4.8 },
  { name: "Swiss Alps", location: "Switzerland", type: "Region", rating: 4.8 },
  { name: "Bern", location: "Switzerland", type: "City", rating: 4.4 },
  { name: "Basel", location: "Switzerland", type: "City", rating: 4.3 },
  { name: "Lausanne", location: "Switzerland", type: "City", rating: 4.4 },
  { name: "St. Moritz", location: "Switzerland", type: "City", rating: 4.6 },
  { name: "Grindelwald", location: "Switzerland", type: "City", rating: 4.6 },

  { name: "Austria", location: "Western Europe", type: "Country", rating: 4.6 },
  { name: "Vienna", location: "Austria", type: "City", rating: 4.6 },
  { name: "Salzburg", location: "Austria", type: "City", rating: 4.6 },
  { name: "Innsbruck", location: "Austria", type: "City", rating: 4.5 },
  { name: "Hallstatt", location: "Austria", type: "City", rating: 4.7 },

  // Europe - Southern Europe
  { name: "Italy", location: "Southern Europe", type: "Country", rating: 4.7 },
  { name: "Rome", location: "Italy", type: "City", rating: 4.6 },
  { name: "Venice", location: "Italy", type: "City", rating: 4.6 },
  { name: "Florence", location: "Italy", type: "City", rating: 4.7 },
  { name: "Milan", location: "Italy", type: "City", rating: 4.4 },
  { name: "Naples", location: "Italy", type: "City", rating: 4.3 },
  { name: "Amalfi Coast", location: "Italy", type: "Region", rating: 4.8 },
  { name: "Positano", location: "Italy", type: "City", rating: 4.7 },
  { name: "Cinque Terre", location: "Italy", type: "Region", rating: 4.7 },
  { name: "Tuscany", location: "Italy", type: "Region", rating: 4.7 },
  { name: "Sicily", location: "Italy", type: "Island", rating: 4.6 },
  { name: "Sardinia", location: "Italy", type: "Island", rating: 4.6 },
  { name: "Lake Como", location: "Italy", type: "Region", rating: 4.7 },
  { name: "Pisa", location: "Italy", type: "City", rating: 4.4 },
  { name: "Bologna", location: "Italy", type: "City", rating: 4.4 },
  { name: "Verona", location: "Italy", type: "City", rating: 4.5 },
  { name: "Capri", location: "Italy", type: "Island", rating: 4.6 },
  { name: "Sorrento", location: "Italy", type: "City", rating: 4.5 },
  { name: "Pompeii", location: "Italy", type: "Landmark", rating: 4.5 },
  { name: "Vatican City", location: "Europe", type: "Country", rating: 4.7 },
  { name: "San Marino", location: "Europe", type: "Country", rating: 4.3 },

  { name: "Spain", location: "Southern Europe", type: "Country", rating: 4.6 },
  { name: "Barcelona", location: "Spain", type: "City", rating: 4.5 },
  { name: "Madrid", location: "Spain", type: "City", rating: 4.4 },
  { name: "Seville", location: "Spain", type: "City", rating: 4.5 },
  { name: "Valencia", location: "Spain", type: "City", rating: 4.4 },
  { name: "Granada", location: "Spain", type: "City", rating: 4.6 },
  { name: "Malaga", location: "Spain", type: "City", rating: 4.4 },
  { name: "Ibiza", location: "Spain", type: "Island", rating: 4.5 },
  { name: "Mallorca", location: "Spain", type: "Island", rating: 4.5 },
  { name: "Canary Islands", location: "Spain", type: "Island", rating: 4.5 },
  { name: "Tenerife", location: "Spain", type: "Island", rating: 4.5 },
  { name: "Costa Brava", location: "Spain", type: "Region", rating: 4.4 },
  { name: "San Sebastian", location: "Spain", type: "City", rating: 4.5 },
  { name: "Bilbao", location: "Spain", type: "City", rating: 4.4 },
  { name: "Toledo", location: "Spain", type: "City", rating: 4.5 },
  { name: "Cordoba", location: "Spain", type: "City", rating: 4.5 },

  { name: "Portugal", location: "Southern Europe", type: "Country", rating: 4.6 },
  { name: "Lisbon", location: "Portugal", type: "City", rating: 4.6 },
  { name: "Porto", location: "Portugal", type: "City", rating: 4.6 },
  { name: "Algarve", location: "Portugal", type: "Region", rating: 4.6 },
  { name: "Madeira", location: "Portugal", type: "Island", rating: 4.6 },
  { name: "Azores", location: "Portugal", type: "Island", rating: 4.6 },
  { name: "Sintra", location: "Portugal", type: "City", rating: 4.6 },

  { name: "Greece", location: "Southern Europe", type: "Country", rating: 4.6 },
  { name: "Athens", location: "Greece", type: "City", rating: 4.4 },
  { name: "Santorini", location: "Greece", type: "Island", rating: 4.8 },
  { name: "Mykonos", location: "Greece", type: "Island", rating: 4.6 },
  { name: "Crete", location: "Greece", type: "Island", rating: 4.6 },
  { name: "Rhodes", location: "Greece", type: "Island", rating: 4.5 },
  { name: "Corfu", location: "Greece", type: "Island", rating: 4.5 },
  { name: "Zakynthos", location: "Greece", type: "Island", rating: 4.6 },
  { name: "Meteora", location: "Greece", type: "Landmark", rating: 4.7 },
  { name: "Thessaloniki", location: "Greece", type: "City", rating: 4.3 },
  { name: "Naxos", location: "Greece", type: "Island", rating: 4.5 },
  { name: "Paros", location: "Greece", type: "Island", rating: 4.5 },
  { name: "Milos", location: "Greece", type: "Island", rating: 4.6 },

  { name: "Croatia", location: "Southern Europe", type: "Country", rating: 4.6 },
  { name: "Dubrovnik", location: "Croatia", type: "City", rating: 4.7 },
  { name: "Split", location: "Croatia", type: "City", rating: 4.5 },
  { name: "Hvar", location: "Croatia", type: "Island", rating: 4.6 },
  { name: "Plitvice Lakes", location: "Croatia", type: "Park", rating: 4.8 },
  { name: "Zagreb", location: "Croatia", type: "City", rating: 4.3 },

  { name: "Malta", location: "Southern Europe", type: "Country", rating: 4.5 },
  { name: "Valletta", location: "Malta", type: "City", rating: 4.5 },
  { name: "Gozo", location: "Malta", type: "Island", rating: 4.5 },

  { name: "Cyprus", location: "Southern Europe", type: "Country", rating: 4.4 },
  { name: "Paphos", location: "Cyprus", type: "City", rating: 4.4 },
  { name: "Limassol", location: "Cyprus", type: "City", rating: 4.3 },
  { name: "Nicosia", location: "Cyprus", type: "City", rating: 4.2 },
  { name: "Ayia Napa", location: "Cyprus", type: "City", rating: 4.3 },

  { name: "Slovenia", location: "Southern Europe", type: "Country", rating: 4.5 },
  { name: "Ljubljana", location: "Slovenia", type: "City", rating: 4.5 },
  { name: "Lake Bled", location: "Slovenia", type: "Region", rating: 4.7 },

  { name: "Montenegro", location: "Southern Europe", type: "Country", rating: 4.5 },
  { name: "Kotor", location: "Montenegro", type: "City", rating: 4.6 },
  { name: "Budva", location: "Montenegro", type: "City", rating: 4.4 },

  { name: "Albania", location: "Southern Europe", type: "Country", rating: 4.3 },
  { name: "Tirana", location: "Albania", type: "City", rating: 4.2 },
  { name: "Albanian Riviera", location: "Albania", type: "Region", rating: 4.5 },

  // Europe - Northern Europe
  { name: "Norway", location: "Northern Europe", type: "Country", rating: 4.7 },
  { name: "Oslo", location: "Norway", type: "City", rating: 4.4 },
  { name: "Bergen", location: "Norway", type: "City", rating: 4.5 },
  { name: "Norwegian Fjords", location: "Norway", type: "Region", rating: 4.8 },
  { name: "Tromsø", location: "Norway", type: "City", rating: 4.5 },
  { name: "Lofoten Islands", location: "Norway", type: "Island", rating: 4.7 },
  { name: "Svalbard", location: "Norway", type: "Region", rating: 4.6 },

  { name: "Sweden", location: "Northern Europe", type: "Country", rating: 4.5 },
  { name: "Stockholm", location: "Sweden", type: "City", rating: 4.5 },
  { name: "Gothenburg", location: "Sweden", type: "City", rating: 4.3 },
  { name: "Malmö", location: "Sweden", type: "City", rating: 4.2 },
  { name: "Swedish Lapland", location: "Sweden", type: "Region", rating: 4.5 },

  { name: "Denmark", location: "Northern Europe", type: "Country", rating: 4.5 },
  { name: "Copenhagen", location: "Denmark", type: "City", rating: 4.5 },

  { name: "Finland", location: "Northern Europe", type: "Country", rating: 4.5 },
  { name: "Helsinki", location: "Finland", type: "City", rating: 4.4 },
  { name: "Finnish Lapland", location: "Finland", type: "Region", rating: 4.6 },
  { name: "Rovaniemi", location: "Finland", type: "City", rating: 4.5 },

  { name: "Iceland", location: "Northern Europe", type: "Country", rating: 4.8 },
  { name: "Reykjavik", location: "Iceland", type: "City", rating: 4.5 },
  { name: "Blue Lagoon", location: "Iceland", type: "Landmark", rating: 4.6 },
  { name: "Golden Circle", location: "Iceland", type: "Region", rating: 4.7 },

  // Europe - Eastern Europe
  { name: "Poland", location: "Eastern Europe", type: "Country", rating: 4.4 },
  { name: "Warsaw", location: "Poland", type: "City", rating: 4.3 },
  { name: "Krakow", location: "Poland", type: "City", rating: 4.6 },
  { name: "Gdansk", location: "Poland", type: "City", rating: 4.4 },
  { name: "Wroclaw", location: "Poland", type: "City", rating: 4.4 },

  { name: "Czech Republic", location: "Eastern Europe", type: "Country", rating: 4.5 },
  { name: "Czechia", location: "Eastern Europe", type: "Country", rating: 4.5 },
  { name: "Prague", location: "Czech Republic", type: "City", rating: 4.6 },
  { name: "Cesky Krumlov", location: "Czech Republic", type: "City", rating: 4.5 },

  { name: "Hungary", location: "Eastern Europe", type: "Country", rating: 4.4 },
  { name: "Budapest", location: "Hungary", type: "City", rating: 4.6 },

  { name: "Romania", location: "Eastern Europe", type: "Country", rating: 4.3 },
  { name: "Bucharest", location: "Romania", type: "City", rating: 4.2 },
  { name: "Transylvania", location: "Romania", type: "Region", rating: 4.5 },
  { name: "Brasov", location: "Romania", type: "City", rating: 4.4 },

  { name: "Bulgaria", location: "Eastern Europe", type: "Country", rating: 4.3 },
  { name: "Sofia", location: "Bulgaria", type: "City", rating: 4.2 },

  { name: "Russia", location: "Eastern Europe", type: "Country", rating: 4.3 },
  { name: "Moscow", location: "Russia", type: "City", rating: 4.4 },
  { name: "St. Petersburg", location: "Russia", type: "City", rating: 4.6 },

  { name: "Ukraine", location: "Eastern Europe", type: "Country", rating: 4.2 },
  { name: "Kyiv", location: "Ukraine", type: "City", rating: 4.3 },
  { name: "Lviv", location: "Ukraine", type: "City", rating: 4.4 },

  { name: "Serbia", location: "Eastern Europe", type: "Country", rating: 4.2 },
  { name: "Belgrade", location: "Serbia", type: "City", rating: 4.3 },

  { name: "Bosnia and Herzegovina", location: "Eastern Europe", type: "Country", rating: 4.3 },
  { name: "Sarajevo", location: "Bosnia and Herzegovina", type: "City", rating: 4.4 },
  { name: "Mostar", location: "Bosnia and Herzegovina", type: "City", rating: 4.5 },

  { name: "North Macedonia", location: "Eastern Europe", type: "Country", rating: 4.2 },
  { name: "Skopje", location: "North Macedonia", type: "City", rating: 4.1 },
  { name: "Lake Ohrid", location: "North Macedonia", type: "Region", rating: 4.5 },

  { name: "Slovakia", location: "Eastern Europe", type: "Country", rating: 4.3 },
  { name: "Bratislava", location: "Slovakia", type: "City", rating: 4.2 },

  { name: "Lithuania", location: "Eastern Europe", type: "Country", rating: 4.3 },
  { name: "Vilnius", location: "Lithuania", type: "City", rating: 4.4 },

  { name: "Latvia", location: "Eastern Europe", type: "Country", rating: 4.2 },
  { name: "Riga", location: "Latvia", type: "City", rating: 4.3 },

  { name: "Estonia", location: "Eastern Europe", type: "Country", rating: 4.3 },
  { name: "Tallinn", location: "Estonia", type: "City", rating: 4.5 },

  { name: "Georgia", location: "Eastern Europe/Asia", type: "Country", rating: 4.5 },
  { name: "Tbilisi", location: "Georgia", type: "City", rating: 4.5 },
  { name: "Batumi", location: "Georgia", type: "City", rating: 4.4 },

  { name: "Armenia", location: "Eastern Europe/Asia", type: "Country", rating: 4.3 },
  { name: "Yerevan", location: "Armenia", type: "City", rating: 4.3 },

  { name: "Azerbaijan", location: "Eastern Europe/Asia", type: "Country", rating: 4.2 },
  { name: "Baku", location: "Azerbaijan", type: "City", rating: 4.3 },

  // North America
  { name: "United States", location: "North America", type: "Country", rating: 4.5 },
  { name: "USA", location: "North America", type: "Country", rating: 4.5 },
  { name: "New York", location: "USA", type: "City", rating: 4.5 },
  { name: "New York City", location: "USA", type: "City", rating: 4.5 },
  { name: "Los Angeles", location: "California, USA", type: "City", rating: 4.3 },
  { name: "San Francisco", location: "California, USA", type: "City", rating: 4.5 },
  { name: "Las Vegas", location: "Nevada, USA", type: "City", rating: 4.4 },
  { name: "Miami", location: "Florida, USA", type: "City", rating: 4.4 },
  { name: "Orlando", location: "Florida, USA", type: "City", rating: 4.3 },
  { name: "Chicago", location: "Illinois, USA", type: "City", rating: 4.3 },
  { name: "Washington DC", location: "USA", type: "City", rating: 4.4 },
  { name: "Boston", location: "Massachusetts, USA", type: "City", rating: 4.4 },
  { name: "Seattle", location: "Washington, USA", type: "City", rating: 4.4 },
  { name: "San Diego", location: "California, USA", type: "City", rating: 4.4 },
  { name: "Hawaii", location: "USA", type: "State", rating: 4.8 },
  { name: "Honolulu", location: "Hawaii, USA", type: "City", rating: 4.6 },
  { name: "Maui", location: "Hawaii, USA", type: "Island", rating: 4.7 },
  { name: "Grand Canyon", location: "Arizona, USA", type: "Park", rating: 4.8 },
  { name: "Yellowstone", location: "Wyoming, USA", type: "Park", rating: 4.8 },
  { name: "Yosemite", location: "California, USA", type: "Park", rating: 4.8 },
  { name: "New Orleans", location: "Louisiana, USA", type: "City", rating: 4.5 },
  { name: "Nashville", location: "Tennessee, USA", type: "City", rating: 4.4 },
  { name: "Austin", location: "Texas, USA", type: "City", rating: 4.3 },
  { name: "Houston", location: "Texas, USA", type: "City", rating: 4.1 },
  { name: "Dallas", location: "Texas, USA", type: "City", rating: 4.1 },
  { name: "Phoenix", location: "Arizona, USA", type: "City", rating: 4.1 },
  { name: "Denver", location: "Colorado, USA", type: "City", rating: 4.3 },
  { name: "Atlanta", location: "Georgia, USA", type: "City", rating: 4.2 },
  { name: "Philadelphia", location: "Pennsylvania, USA", type: "City", rating: 4.2 },
  { name: "Portland", location: "Oregon, USA", type: "City", rating: 4.3 },
  { name: "Alaska", location: "USA", type: "State", rating: 4.6 },
  { name: "Florida Keys", location: "Florida, USA", type: "Region", rating: 4.5 },
  { name: "Key West", location: "Florida, USA", type: "City", rating: 4.5 },
  { name: "Aspen", location: "Colorado, USA", type: "City", rating: 4.5 },
  { name: "Napa Valley", location: "California, USA", type: "Region", rating: 4.6 },
  { name: "Santa Monica", location: "California, USA", type: "City", rating: 4.4 },
  { name: "Malibu", location: "California, USA", type: "City", rating: 4.4 },

  { name: "Canada", location: "North America", type: "Country", rating: 4.6 },
  { name: "Toronto", location: "Ontario, Canada", type: "City", rating: 4.4 },
  { name: "Vancouver", location: "British Columbia, Canada", type: "City", rating: 4.6 },
  { name: "Montreal", location: "Quebec, Canada", type: "City", rating: 4.5 },
  { name: "Quebec City", location: "Quebec, Canada", type: "City", rating: 4.6 },
  { name: "Calgary", location: "Alberta, Canada", type: "City", rating: 4.3 },
  { name: "Banff", location: "Alberta, Canada", type: "City", rating: 4.7 },
  { name: "Niagara Falls", location: "Ontario, Canada", type: "Landmark", rating: 4.6 },
  { name: "Whistler", location: "British Columbia, Canada", type: "City", rating: 4.6 },
  { name: "Ottawa", location: "Ontario, Canada", type: "City", rating: 4.2 },
  { name: "Victoria", location: "British Columbia, Canada", type: "City", rating: 4.4 },
  { name: "Halifax", location: "Nova Scotia, Canada", type: "City", rating: 4.3 },

  { name: "Mexico", location: "North America", type: "Country", rating: 4.5 },
  { name: "Mexico City", location: "Mexico", type: "City", rating: 4.4 },
  { name: "Cancun", location: "Mexico", type: "City", rating: 4.5 },
  { name: "Playa del Carmen", location: "Mexico", type: "City", rating: 4.5 },
  { name: "Tulum", location: "Mexico", type: "City", rating: 4.6 },
  { name: "Puerto Vallarta", location: "Mexico", type: "City", rating: 4.5 },
  { name: "Cabo San Lucas", location: "Mexico", type: "City", rating: 4.5 },
  { name: "Oaxaca", location: "Mexico", type: "City", rating: 4.5 },
  { name: "San Miguel de Allende", location: "Mexico", type: "City", rating: 4.6 },
  { name: "Riviera Maya", location: "Mexico", type: "Region", rating: 4.6 },
  { name: "Cozumel", location: "Mexico", type: "Island", rating: 4.5 },
  { name: "Guadalajara", location: "Mexico", type: "City", rating: 4.3 },

  // Caribbean
  { name: "Caribbean", location: "Central America", type: "Region", rating: 4.7 },
  { name: "Jamaica", location: "Caribbean", type: "Country", rating: 4.5 },
  { name: "Montego Bay", location: "Jamaica", type: "City", rating: 4.4 },
  { name: "Negril", location: "Jamaica", type: "City", rating: 4.5 },
  { name: "Dominican Republic", location: "Caribbean", type: "Country", rating: 4.5 },
  { name: "Punta Cana", location: "Dominican Republic", type: "City", rating: 4.5 },
  { name: "Santo Domingo", location: "Dominican Republic", type: "City", rating: 4.2 },
  { name: "Cuba", location: "Caribbean", type: "Country", rating: 4.4 },
  { name: "Havana", location: "Cuba", type: "City", rating: 4.5 },
  { name: "Varadero", location: "Cuba", type: "City", rating: 4.4 },
  { name: "Puerto Rico", location: "Caribbean", type: "Country", rating: 4.5 },
  { name: "San Juan", location: "Puerto Rico", type: "City", rating: 4.4 },
  { name: "Bahamas", location: "Caribbean", type: "Country", rating: 4.6 },
  { name: "Nassau", location: "Bahamas", type: "City", rating: 4.4 },
  { name: "Exuma", location: "Bahamas", type: "Island", rating: 4.7 },
  { name: "Barbados", location: "Caribbean", type: "Country", rating: 4.5 },
  { name: "Aruba", location: "Caribbean", type: "Country", rating: 4.6 },
  { name: "St. Lucia", location: "Caribbean", type: "Country", rating: 4.6 },
  { name: "Turks and Caicos", location: "Caribbean", type: "Country", rating: 4.7 },
  { name: "US Virgin Islands", location: "Caribbean", type: "Region", rating: 4.5 },
  { name: "St. Thomas", location: "US Virgin Islands", type: "Island", rating: 4.5 },
  { name: "British Virgin Islands", location: "Caribbean", type: "Country", rating: 4.6 },
  { name: "Cayman Islands", location: "Caribbean", type: "Country", rating: 4.5 },
  { name: "Trinidad and Tobago", location: "Caribbean", type: "Country", rating: 4.3 },
  { name: "Curacao", location: "Caribbean", type: "Country", rating: 4.5 },
  { name: "St. Maarten", location: "Caribbean", type: "Island", rating: 4.4 },
  { name: "Antigua", location: "Caribbean", type: "Country", rating: 4.5 },

  // Central America
  { name: "Costa Rica", location: "Central America", type: "Country", rating: 4.6 },
  { name: "San Jose", location: "Costa Rica", type: "City", rating: 4.1 },
  { name: "Manuel Antonio", location: "Costa Rica", type: "Park", rating: 4.6 },
  { name: "Monteverde", location: "Costa Rica", type: "Region", rating: 4.6 },
  { name: "Arenal", location: "Costa Rica", type: "Region", rating: 4.5 },
  { name: "Guanacaste", location: "Costa Rica", type: "Region", rating: 4.5 },
  { name: "La Fortuna", location: "Costa Rica", type: "City", rating: 4.5 },

  { name: "Panama", location: "Central America", type: "Country", rating: 4.4 },
  { name: "Panama City", location: "Panama", type: "City", rating: 4.3 },
  { name: "Bocas del Toro", location: "Panama", type: "Island", rating: 4.5 },
  { name: "San Blas Islands", location: "Panama", type: "Island", rating: 4.6 },

  { name: "Guatemala", location: "Central America", type: "Country", rating: 4.4 },
  { name: "Guatemala City", location: "Guatemala", type: "City", rating: 4.0 },
  { name: "Antigua Guatemala", location: "Guatemala", type: "City", rating: 4.6 },
  { name: "Lake Atitlan", location: "Guatemala", type: "Region", rating: 4.6 },
  { name: "Tikal", location: "Guatemala", type: "Landmark", rating: 4.7 },

  { name: "Belize", location: "Central America", type: "Country", rating: 4.5 },
  { name: "Belize City", location: "Belize", type: "City", rating: 4.0 },
  { name: "Ambergris Caye", location: "Belize", type: "Island", rating: 4.5 },
  { name: "Caye Caulker", location: "Belize", type: "Island", rating: 4.5 },

  { name: "Nicaragua", location: "Central America", type: "Country", rating: 4.3 },
  { name: "Granada", location: "Nicaragua", type: "City", rating: 4.4 },
  { name: "San Juan del Sur", location: "Nicaragua", type: "City", rating: 4.4 },

  { name: "Honduras", location: "Central America", type: "Country", rating: 4.2 },
  { name: "Roatan", location: "Honduras", type: "Island", rating: 4.5 },

  { name: "El Salvador", location: "Central America", type: "Country", rating: 4.2 },
  { name: "San Salvador", location: "El Salvador", type: "City", rating: 4.0 },
  { name: "El Tunco", location: "El Salvador", type: "City", rating: 4.4 },

  // South America
  { name: "Brazil", location: "South America", type: "Country", rating: 4.5 },
  { name: "Rio de Janeiro", location: "Brazil", type: "City", rating: 4.6 },
  { name: "Sao Paulo", location: "Brazil", type: "City", rating: 4.2 },
  { name: "Salvador", location: "Brazil", type: "City", rating: 4.4 },
  { name: "Amazon Rainforest", location: "Brazil", type: "Region", rating: 4.7 },
  { name: "Iguazu Falls", location: "Brazil/Argentina", type: "Landmark", rating: 4.8 },
  { name: "Fernando de Noronha", location: "Brazil", type: "Island", rating: 4.8 },
  { name: "Florianopolis", location: "Brazil", type: "City", rating: 4.5 },
  { name: "Buzios", location: "Brazil", type: "City", rating: 4.4 },
  { name: "Paraty", location: "Brazil", type: "City", rating: 4.5 },

  { name: "Argentina", location: "South America", type: "Country", rating: 4.5 },
  { name: "Buenos Aires", location: "Argentina", type: "City", rating: 4.5 },
  { name: "Patagonia", location: "Argentina", type: "Region", rating: 4.8 },
  { name: "Mendoza", location: "Argentina", type: "City", rating: 4.5 },
  { name: "Bariloche", location: "Argentina", type: "City", rating: 4.6 },
  { name: "Ushuaia", location: "Argentina", type: "City", rating: 4.6 },
  { name: "El Calafate", location: "Argentina", type: "City", rating: 4.6 },
  { name: "Perito Moreno Glacier", location: "Argentina", type: "Landmark", rating: 4.8 },

  { name: "Peru", location: "South America", type: "Country", rating: 4.6 },
  { name: "Lima", location: "Peru", type: "City", rating: 4.3 },
  { name: "Cusco", location: "Peru", type: "City", rating: 4.6 },
  { name: "Machu Picchu", location: "Peru", type: "Landmark", rating: 4.9 },
  { name: "Sacred Valley", location: "Peru", type: "Region", rating: 4.6 },
  { name: "Arequipa", location: "Peru", type: "City", rating: 4.4 },
  { name: "Lake Titicaca", location: "Peru/Bolivia", type: "Region", rating: 4.5 },

  { name: "Chile", location: "South America", type: "Country", rating: 4.5 },
  { name: "Santiago", location: "Chile", type: "City", rating: 4.3 },
  { name: "Atacama Desert", location: "Chile", type: "Region", rating: 4.7 },
  { name: "Valparaiso", location: "Chile", type: "City", rating: 4.5 },
  { name: "Easter Island", location: "Chile", type: "Island", rating: 4.7 },
  { name: "Torres del Paine", location: "Chile", type: "Park", rating: 4.8 },

  { name: "Colombia", location: "South America", type: "Country", rating: 4.5 },
  { name: "Bogota", location: "Colombia", type: "City", rating: 4.2 },
  { name: "Cartagena", location: "Colombia", type: "City", rating: 4.6 },
  { name: "Medellin", location: "Colombia", type: "City", rating: 4.5 },
  { name: "Santa Marta", location: "Colombia", type: "City", rating: 4.4 },
  { name: "San Andres", location: "Colombia", type: "Island", rating: 4.5 },
  { name: "Tayrona", location: "Colombia", type: "Park", rating: 4.6 },

  { name: "Ecuador", location: "South America", type: "Country", rating: 4.5 },
  { name: "Quito", location: "Ecuador", type: "City", rating: 4.4 },
  { name: "Galapagos Islands", location: "Ecuador", type: "Island", rating: 4.9 },
  { name: "Cuenca", location: "Ecuador", type: "City", rating: 4.4 },

  { name: "Bolivia", location: "South America", type: "Country", rating: 4.4 },
  { name: "La Paz", location: "Bolivia", type: "City", rating: 4.3 },
  { name: "Salar de Uyuni", location: "Bolivia", type: "Landmark", rating: 4.8 },

  { name: "Uruguay", location: "South America", type: "Country", rating: 4.4 },
  { name: "Montevideo", location: "Uruguay", type: "City", rating: 4.3 },
  { name: "Punta del Este", location: "Uruguay", type: "City", rating: 4.5 },
  { name: "Colonia del Sacramento", location: "Uruguay", type: "City", rating: 4.5 },

  { name: "Venezuela", location: "South America", type: "Country", rating: 4.2 },
  { name: "Caracas", location: "Venezuela", type: "City", rating: 4.0 },
  { name: "Angel Falls", location: "Venezuela", type: "Landmark", rating: 4.7 },

  { name: "Paraguay", location: "South America", type: "Country", rating: 4.1 },
  { name: "Asuncion", location: "Paraguay", type: "City", rating: 4.0 },

  // Africa
  { name: "South Africa", location: "Africa", type: "Country", rating: 4.6 },
  { name: "Cape Town", location: "South Africa", type: "City", rating: 4.7 },
  { name: "Johannesburg", location: "South Africa", type: "City", rating: 4.2 },
  { name: "Kruger National Park", location: "South Africa", type: "Park", rating: 4.8 },
  { name: "Garden Route", location: "South Africa", type: "Region", rating: 4.6 },
  { name: "Table Mountain", location: "South Africa", type: "Landmark", rating: 4.7 },
  { name: "Durban", location: "South Africa", type: "City", rating: 4.3 },

  { name: "Egypt", location: "Africa", type: "Country", rating: 4.5 },
  { name: "Cairo", location: "Egypt", type: "City", rating: 4.4 },
  { name: "Pyramids of Giza", location: "Egypt", type: "Landmark", rating: 4.8 },
  { name: "Luxor", location: "Egypt", type: "City", rating: 4.6 },
  { name: "Sharm El Sheikh", location: "Egypt", type: "City", rating: 4.5 },
  { name: "Hurghada", location: "Egypt", type: "City", rating: 4.4 },
  { name: "Alexandria", location: "Egypt", type: "City", rating: 4.3 },
  { name: "Aswan", location: "Egypt", type: "City", rating: 4.5 },

  { name: "Morocco", location: "Africa", type: "Country", rating: 4.6 },
  { name: "Marrakech", location: "Morocco", type: "City", rating: 4.6 },
  { name: "Fes", location: "Morocco", type: "City", rating: 4.5 },
  { name: "Casablanca", location: "Morocco", type: "City", rating: 4.2 },
  { name: "Chefchaouen", location: "Morocco", type: "City", rating: 4.6 },
  { name: "Sahara Desert", location: "Morocco", type: "Region", rating: 4.7 },
  { name: "Essaouira", location: "Morocco", type: "City", rating: 4.5 },
  { name: "Tangier", location: "Morocco", type: "City", rating: 4.3 },

  { name: "Kenya", location: "Africa", type: "Country", rating: 4.6 },
  { name: "Nairobi", location: "Kenya", type: "City", rating: 4.2 },
  { name: "Masai Mara", location: "Kenya", type: "Park", rating: 4.8 },
  { name: "Mombasa", location: "Kenya", type: "City", rating: 4.3 },
  { name: "Diani Beach", location: "Kenya", type: "Region", rating: 4.5 },

  { name: "Tanzania", location: "Africa", type: "Country", rating: 4.6 },
  { name: "Dar es Salaam", location: "Tanzania", type: "City", rating: 4.1 },
  { name: "Serengeti", location: "Tanzania", type: "Park", rating: 4.9 },
  { name: "Zanzibar", location: "Tanzania", type: "Island", rating: 4.7 },
  { name: "Mount Kilimanjaro", location: "Tanzania", type: "Landmark", rating: 4.8 },
  { name: "Ngorongoro Crater", location: "Tanzania", type: "Park", rating: 4.8 },

  { name: "Ethiopia", location: "Africa", type: "Country", rating: 4.3 },
  { name: "Addis Ababa", location: "Ethiopia", type: "City", rating: 4.1 },
  { name: "Lalibela", location: "Ethiopia", type: "City", rating: 4.6 },

  { name: "Uganda", location: "Africa", type: "Country", rating: 4.4 },
  { name: "Kampala", location: "Uganda", type: "City", rating: 4.1 },
  { name: "Bwindi", location: "Uganda", type: "Park", rating: 4.7 },

  { name: "Rwanda", location: "Africa", type: "Country", rating: 4.5 },
  { name: "Kigali", location: "Rwanda", type: "City", rating: 4.3 },
  { name: "Volcanoes National Park", location: "Rwanda", type: "Park", rating: 4.7 },

  { name: "Botswana", location: "Africa", type: "Country", rating: 4.6 },
  { name: "Okavango Delta", location: "Botswana", type: "Region", rating: 4.8 },
  { name: "Chobe", location: "Botswana", type: "Park", rating: 4.7 },

  { name: "Namibia", location: "Africa", type: "Country", rating: 4.6 },
  { name: "Windhoek", location: "Namibia", type: "City", rating: 4.2 },
  { name: "Sossusvlei", location: "Namibia", type: "Region", rating: 4.7 },
  { name: "Etosha", location: "Namibia", type: "Park", rating: 4.6 },

  { name: "Zimbabwe", location: "Africa", type: "Country", rating: 4.4 },
  { name: "Victoria Falls", location: "Zimbabwe/Zambia", type: "Landmark", rating: 4.8 },
  { name: "Harare", location: "Zimbabwe", type: "City", rating: 4.0 },

  { name: "Zambia", location: "Africa", type: "Country", rating: 4.4 },
  { name: "Lusaka", location: "Zambia", type: "City", rating: 4.0 },
  { name: "Livingstone", location: "Zambia", type: "City", rating: 4.5 },

  { name: "Mozambique", location: "Africa", type: "Country", rating: 4.4 },
  { name: "Maputo", location: "Mozambique", type: "City", rating: 4.2 },
  { name: "Bazaruto", location: "Mozambique", type: "Island", rating: 4.6 },

  { name: "Madagascar", location: "Africa", type: "Country", rating: 4.5 },
  { name: "Antananarivo", location: "Madagascar", type: "City", rating: 4.0 },
  { name: "Nosy Be", location: "Madagascar", type: "Island", rating: 4.5 },

  { name: "Mauritius", location: "Africa", type: "Country", rating: 4.7 },
  { name: "Port Louis", location: "Mauritius", type: "City", rating: 4.3 },

  { name: "Seychelles", location: "Africa", type: "Country", rating: 4.8 },
  { name: "Mahe", location: "Seychelles", type: "Island", rating: 4.7 },
  { name: "Praslin", location: "Seychelles", type: "Island", rating: 4.7 },
  { name: "La Digue", location: "Seychelles", type: "Island", rating: 4.7 },

  { name: "Tunisia", location: "Africa", type: "Country", rating: 4.3 },
  { name: "Tunis", location: "Tunisia", type: "City", rating: 4.2 },

  { name: "Ghana", location: "Africa", type: "Country", rating: 4.2 },
  { name: "Accra", location: "Ghana", type: "City", rating: 4.2 },

  { name: "Nigeria", location: "Africa", type: "Country", rating: 4.1 },
  { name: "Lagos", location: "Nigeria", type: "City", rating: 4.1 },

  { name: "Senegal", location: "Africa", type: "Country", rating: 4.3 },
  { name: "Dakar", location: "Senegal", type: "City", rating: 4.2 },

  // Oceania
  { name: "Australia", location: "Oceania", type: "Country", rating: 4.6 },
  { name: "Sydney", location: "Australia", type: "City", rating: 4.5 },
  { name: "Melbourne", location: "Australia", type: "City", rating: 4.5 },
  { name: "Brisbane", location: "Australia", type: "City", rating: 4.3 },
  { name: "Perth", location: "Australia", type: "City", rating: 4.3 },
  { name: "Gold Coast", location: "Australia", type: "City", rating: 4.4 },
  { name: "Great Barrier Reef", location: "Australia", type: "Landmark", rating: 4.8 },
  { name: "Cairns", location: "Australia", type: "City", rating: 4.4 },
  { name: "Uluru", location: "Australia", type: "Landmark", rating: 4.7 },
  { name: "Adelaide", location: "Australia", type: "City", rating: 4.2 },
  { name: "Tasmania", location: "Australia", type: "State", rating: 4.6 },
  { name: "Hobart", location: "Australia", type: "City", rating: 4.4 },
  { name: "Byron Bay", location: "Australia", type: "City", rating: 4.5 },
  { name: "Whitsunday Islands", location: "Australia", type: "Island", rating: 4.7 },
  { name: "Great Ocean Road", location: "Australia", type: "Region", rating: 4.6 },
  { name: "Kangaroo Island", location: "Australia", type: "Island", rating: 4.5 },
  { name: "Darwin", location: "Australia", type: "City", rating: 4.2 },

  { name: "New Zealand", location: "Oceania", type: "Country", rating: 4.7 },
  { name: "Auckland", location: "New Zealand", type: "City", rating: 4.4 },
  { name: "Queenstown", location: "New Zealand", type: "City", rating: 4.7 },
  { name: "Wellington", location: "New Zealand", type: "City", rating: 4.4 },
  { name: "Rotorua", location: "New Zealand", type: "City", rating: 4.4 },
  { name: "Milford Sound", location: "New Zealand", type: "Region", rating: 4.8 },
  { name: "Christchurch", location: "New Zealand", type: "City", rating: 4.3 },
  { name: "Hobbiton", location: "New Zealand", type: "Landmark", rating: 4.6 },
  { name: "Bay of Islands", location: "New Zealand", type: "Region", rating: 4.5 },
  { name: "Wanaka", location: "New Zealand", type: "City", rating: 4.6 },

  { name: "Fiji", location: "Oceania", type: "Country", rating: 4.7 },
  { name: "Suva", location: "Fiji", type: "City", rating: 4.2 },
  { name: "Nadi", location: "Fiji", type: "City", rating: 4.4 },
  { name: "Mamanuca Islands", location: "Fiji", type: "Island", rating: 4.7 },
  { name: "Yasawa Islands", location: "Fiji", type: "Island", rating: 4.7 },

  { name: "French Polynesia", location: "Oceania", type: "Country", rating: 4.8 },
  { name: "Tahiti", location: "French Polynesia", type: "Island", rating: 4.7 },
  { name: "Bora Bora", location: "French Polynesia", type: "Island", rating: 4.9 },
  { name: "Moorea", location: "French Polynesia", type: "Island", rating: 4.8 },

  { name: "Maldives", location: "Asia", type: "Country", rating: 4.9 },
  { name: "Male", location: "Maldives", type: "City", rating: 4.3 },

  { name: "Samoa", location: "Oceania", type: "Country", rating: 4.5 },
  { name: "Apia", location: "Samoa", type: "City", rating: 4.3 },

  { name: "Vanuatu", location: "Oceania", type: "Country", rating: 4.5 },
  { name: "Port Vila", location: "Vanuatu", type: "City", rating: 4.3 },

  { name: "Cook Islands", location: "Oceania", type: "Country", rating: 4.6 },
  { name: "Rarotonga", location: "Cook Islands", type: "Island", rating: 4.6 },

  { name: "Tonga", location: "Oceania", type: "Country", rating: 4.4 },
  { name: "Papua New Guinea", location: "Oceania", type: "Country", rating: 4.3 },

  { name: "Palau", location: "Oceania", type: "Country", rating: 4.6 },
  { name: "Guam", location: "Oceania", type: "Territory", rating: 4.3 },
  { name: "New Caledonia", location: "Oceania", type: "Territory", rating: 4.5 },
  { name: "Noumea", location: "New Caledonia", type: "City", rating: 4.4 },

  // Central Asia
  { name: "Kazakhstan", location: "Central Asia", type: "Country", rating: 4.2 },
  { name: "Almaty", location: "Kazakhstan", type: "City", rating: 4.3 },
  { name: "Astana", location: "Kazakhstan", type: "City", rating: 4.2 },

  { name: "Uzbekistan", location: "Central Asia", type: "Country", rating: 4.5 },
  { name: "Samarkand", location: "Uzbekistan", type: "City", rating: 4.6 },
  { name: "Bukhara", location: "Uzbekistan", type: "City", rating: 4.5 },
  { name: "Tashkent", location: "Uzbekistan", type: "City", rating: 4.2 },

  { name: "Kyrgyzstan", location: "Central Asia", type: "Country", rating: 4.4 },
  { name: "Bishkek", location: "Kyrgyzstan", type: "City", rating: 4.2 },
  { name: "Issyk-Kul", location: "Kyrgyzstan", type: "Region", rating: 4.5 },

  { name: "Tajikistan", location: "Central Asia", type: "Country", rating: 4.3 },
  { name: "Dushanbe", location: "Tajikistan", type: "City", rating: 4.1 },

  { name: "Turkmenistan", location: "Central Asia", type: "Country", rating: 4.2 },
  { name: "Ashgabat", location: "Turkmenistan", type: "City", rating: 4.2 },

  { name: "Mongolia", location: "Central Asia", type: "Country", rating: 4.4 },
  { name: "Ulaanbaatar", location: "Mongolia", type: "City", rating: 4.2 },
  { name: "Gobi Desert", location: "Mongolia", type: "Region", rating: 4.5 },

  // Antarctica
  { name: "Antarctica", location: "Antarctica", type: "Continent", rating: 4.9 },
];

export function PlaceSuggestions({ value, onChange, placeholder, className }: PlaceSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(popularDestinations.slice(0, 10));
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const searchValue = value.toLowerCase();
      const filtered = popularDestinations.filter(place =>
        place.name.toLowerCase().includes(searchValue) ||
        place.location.toLowerCase().includes(searchValue)
      );
      // Sort by relevance: exact match first, then starts with, then includes
      const sorted = filtered.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        // Exact match first
        if (aName === searchValue) return -1;
        if (bName === searchValue) return 1;
        
        // Starts with second
        if (aName.startsWith(searchValue) && !bName.startsWith(searchValue)) return -1;
        if (bName.startsWith(searchValue) && !aName.startsWith(searchValue)) return 1;
        
        // Then by rating
        return b.rating - a.rating;
      });
      
      setFilteredSuggestions(sorted.slice(0, 15));
    } else {
      // Show top rated destinations when no search
      const topRated = [...popularDestinations]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);
      setFilteredSuggestions(topRated);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Country': return 'bg-primary/10 text-primary';
      case 'City': return 'bg-ocean/10 text-ocean';
      case 'Island': return 'bg-terracotta/10 text-terracotta';
      case 'Region': return 'bg-green-500/10 text-green-600';
      case 'State': return 'bg-purple-500/10 text-purple-600';
      case 'Park': return 'bg-emerald-500/10 text-emerald-600';
      case 'Landmark': return 'bg-amber-500/10 text-amber-600';
      case 'Continent': return 'bg-indigo-500/10 text-indigo-600';
      case 'Territory': return 'bg-cyan-500/10 text-cyan-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className={cn("pl-10", className)}
        />
      </div>
      
      {showSuggestions && (
        <Card className="absolute z-[100] w-full mt-2 bg-background border border-border shadow-xl max-h-80 overflow-hidden rounded-xl">
          <CardContent className="p-0">
            {filteredSuggestions.length > 0 ? (
              <div className="overflow-y-auto max-h-80">
                <div className="p-2 border-b border-border/50 bg-muted/30 sticky top-0">
                  <p className="text-xs text-muted-foreground font-medium px-2">
                    {value ? `Results for "${value}"` : "Popular Destinations"}
                  </p>
                </div>
                <div className="p-1">
                  {filteredSuggestions.map((place, index) => (
                    <div
                      key={`${place.name}-${place.location}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-all duration-150 group"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(place.name);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                            {place.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{place.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          getTypeColor(place.type)
                        )}>
                          {place.type}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{place.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No destinations found</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try searching for a different city or country
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
