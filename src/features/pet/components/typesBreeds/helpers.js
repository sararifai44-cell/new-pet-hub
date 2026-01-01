export const mapTypesFromResponse = (petTypesResponse) => {
  if (!petTypesResponse) return [];
  const raw = petTypesResponse.data ?? petTypesResponse;

  return raw.map((t) => ({
    type_id: t.id,
    name: t.name,
    name_en: t.name_en,
    name_ar: t.name_ar,
    breeds: (t.breeds || []).map((b) => ({
      breed_id: b.id,
      name: b.name,
      name_en: b.name_en,
      name_ar: b.name_ar,
    })),
  }));
};

export const getBreedsCountForType = (types, typeId) => {
  const type = types.find((t) => t.type_id === typeId);
  return type?.breeds?.length ?? 0;
};

export const filterTypesList = (types, search) => {
  const q = search.trim().toLowerCase();
  if (!q) return types;

  return types.filter(
    (t) =>
      (t.name_en || t.name || "").toLowerCase().includes(q) ||
      (t.name_ar || "").toLowerCase().includes(q)
  );
};

export const filterBreedsList = (selectedType, search) => {
  if (!selectedType) return [];
  const q = search.trim().toLowerCase();
  const list = selectedType.breeds || [];
  if (!q) return list;

  return list.filter(
    (b) =>
      (b.name_en || b.name || "").toLowerCase().includes(q) ||
      (b.name_ar || "").toLowerCase().includes(q)
  );
};
