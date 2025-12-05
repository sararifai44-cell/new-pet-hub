// src/lib/mockData.js

export const defaultProductImages = {
  dogFood:
    "https://images.pexels.com/photos/5731865/pexels-photo-5731865.jpeg?auto=compress&cs=tinysrgb&w=400",
  catFood:
    "https://images.pexels.com/photos/6235108/pexels-photo-6235108.jpeg?auto=compress&cs=tinysrgb&w=400",
  toy: "https://images.pexels.com/photos/15639115/pexels-photo-15639115.jpeg?auto=compress&cs=tinysrgb&w=400",
  bed: "https://images.pexels.com/photos/7474391/pexels-photo-7474391.jpeg?auto=compress&cs=tinysrgb&w=400",
};
export const mockProducts = [
  {
    id: 1,
    name: "Premium Dog Food",
    description: "High-quality dry food for adult dogs.",
    price: 29.99,
    stock_quantity: 25,
    category: "Food",
    image_url: defaultProductImages.dogFood,
  },
  {
    id: 2,
    name: "Indoor Cat Food",
    description: "Balanced nutrition for indoor cats.",
    price: 24.5,
    stock_quantity: 18,
    category: "Food",
    image_url: defaultProductImages.catFood,
  },
  {
    id: 3,
    name: "Rubber Bone Toy",
    description: "Durable chew toy for active dogs.",
    price: 9.99,
    stock_quantity: 40,
    category: "Toys",
    image_url: defaultProductImages.toy,
  },
  {
    id: 4,
    name: "Soft Pet Bed",
    description: "Comfortable bed suitable for small dogs and cats.",
    price: 39.99,
    stock_quantity: 10,
    category: "Beds",
    image_url: defaultProductImages.bed,
  },
];
export const mockPets = [
  {
    pet_id: 1,
    name: "Luna",
    owner_id: 101,
    breed_id: 1,
    date_of_birth: "2022-03-15",
    gender: "Female",
    description:
      "Friendly and playful cat with beautiful blue eyes. Loves to cuddle and play with toys.",
    is_adoptable: true,
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=300&fit=crop",
    ],
    owner: { user_id: 101, full_name: "Ahmed Ali" },
    breed: {
      breed_id: 1,
      name: "Siamese",
      type: { type_id: 1, name: "Cat" },
    },
  },
  {
    pet_id: 2,
    name: "Max",
    owner_id: 102,
    breed_id: 5,
    date_of_birth: "2021-07-20",
    gender: "Male",
    description:
      "Loyal and energetic dog. Great with kids and loves outdoor activities.",
    is_adoptable: false,
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    ],
    owner: { user_id: 102, full_name: "Sarah Mohamed" },
    breed: {
      breed_id: 5,
      name: "Golden Retriever",
      type: { type_id: 2, name: "Dog" },
    },
  },
  {
    pet_id: 3,
    name: "Bella",
    owner_id: 103,
    breed_id: 1,
    date_of_birth: "2023-01-10",
    gender: "Female",
    description:
      "Calm and affectionate cat. Enjoys quiet environments and gentle petting.",
    is_adoptable: true,
    images: [
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=300&fit=crop",
    ],
    owner: { user_id: 103, full_name: "John Doe" },
    breed: {
      breed_id: 1,
      name: "Siamese",
      type: { type_id: 1, name: "Cat" },
    },
  },
  {
    pet_id: 4,
    name: "Coco",
    owner_id: 104,
    breed_id: 8,
    date_of_birth: "2022-11-05",
    gender: "Male",
    description:
      "Colorful and talkative parrot. Can mimic sounds and loves interaction.",
    is_adoptable: true,
    images: [
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551085254-e96b210db58a?w=400&h=300&fit=crop",
    ],
    owner: { user_id: 104, full_name: "Lina Hassan" },
    breed: {
      breed_id: 8,
      name: "African Grey",
      type: { type_id: 3, name: "Bird" },
    },
  },
  {
    pet_id: 5,
    name: "Snowball",
    owner_id: 105,
    breed_id: 10,
    date_of_birth: "2023-03-20",
    gender: "Female",
    description: "Fluffy and gentle rabbit. Very clean and litter-trained.",
    is_adoptable: false,
    images: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=400&h=300&fit=crop",
    ],
    owner: { user_id: 105, full_name: "Omar Khalid" },
    breed: {
      breed_id: 10,
      name: "Himalayan",
      type: { type_id: 4, name: "Rabbit" },
    },
  },
  {
    pet_id: 6,
    name: "Spike",
    owner_id: 106,
    breed_id: 12,
    date_of_birth: "2022-08-12",
    gender: "Male",
    description:
      "Friendly bearded dragon. Enjoys basking and eating vegetables.",
    is_adoptable: true,
    images: [
      "https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1578779189906-6d5c6cc1bc6a?w=400&h=300&fit=crop",
    ],
    owner: { user_id: 106, full_name: "Nour Ali" },
    breed: {
      breed_id: 12,
      name: "Bearded Dragon",
      type: { type_id: 5, name: "Reptile" },
    },
  },
  {
    pet_id: 7,
    name: "Milo",
    owner_id: 107,
    breed_id: 3,
    date_of_birth: "2022-05-18",
    gender: "Male",
    description:
      "Energetic Bengal cat with beautiful spotted coat. Loves climbing and playing.",
    is_adoptable: true,
    images: [
      "https://images.unsplash.com/photo-1574231164645-d6f0e8553590?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&h=300&fit=crop",
    ],
    owner: { user_id: 107, full_name: "Fatima Ahmed" },
    breed: {
      breed_id: 3,
      name: "Bengal",
      type: { type_id: 1, name: "Cat" },
    },
  },
  {
    pet_id: 8,
    name: "Daisy",
    owner_id: 108,
    breed_id: 4,
    date_of_birth: "2020-09-30",
    gender: "Female",
    description:
      "Intelligent and protective German Shepherd. Trained in basic commands.",
    is_adoptable: true,
    images: [
      "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1589941004897-03a8f5c6f0a3?w=400&h=300&fit=crop",
    ],
    owner: { user_id: 108, full_name: "Khalid Mahmoud" },
    breed: {
      breed_id: 4,
      name: "German Shepherd",
      type: { type_id: 2, name: "Dog" },
    },
  },
];

export const mockBreeds = [
  { breed_id: 1, type_id: 1, name: "Siamese" },
  { breed_id: 2, type_id: 1, name: "Persian" },
  { breed_id: 3, type_id: 1, name: "Bengal" },
  { breed_id: 4, type_id: 2, name: "German Shepherd" },
  { breed_id: 5, type_id: 2, name: "Golden Retriever" },
  { breed_id: 6, type_id: 2, name: "Bulldog" },
  { breed_id: 7, type_id: 3, name: "Budgerigar" },
  { breed_id: 8, type_id: 3, name: "African Grey" },
  { breed_id: 9, type_id: 4, name: "Dutch" },
  { breed_id: 10, type_id: 4, name: "Himalayan" },
  { breed_id: 11, type_id: 5, name: "Leopard Gecko" },
  { breed_id: 12, type_id: 5, name: "Bearded Dragon" },
];

export const mockPetTypes = [
  { type_id: 1, name: "Cat" },
  { type_id: 2, name: "Dog" },
  { type_id: 3, name: "Bird" },
  { type_id: 4, name: "Rabbit" },
  { type_id: 5, name: "Reptile" },
  { type_id: 6, name: "Fish" },
];

export const defaultPetImages = {
  cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
  dog: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
  bird: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
  rabbit:
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
  reptile:
    "https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=400&h=300&fit=crop",
  fish: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop",
};
