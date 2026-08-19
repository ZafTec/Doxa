import { toItemDetailsDto, toItemListDto } from './item.mapper';

const now = new Date('2026-08-19T12:00:00.000Z');

const item: Parameters<typeof toItemDetailsDto>[0] = {
  id: 'item-1',
  categoryId: 'category-1',
  brand: 'Doxa',
  description: 'Professional dive watch',
  createdAt: now,
  updatedAt: now,
  category: {
    id: 'category-1',
    name: 'Dive watches',
    createdAt: now,
    updatedAt: now,
  },
  itemVariants: [
    {
      id: 'variant-1',
      itemId: 'item-1',
      color: 'Orange',
      stockQuantity: 3,
      price: 249900,
      name: 'SUB 300 Professional',
      description: 'Orange dial',
      assets: [{ url: 'https://cdn.example.com/orange-front.webp' }],
    },
    {
      id: 'variant-2',
      itemId: 'item-1',
      color: 'Black',
      stockQuantity: 2,
      price: 259900,
      name: 'SUB 300 Sharkhunter',
      description: 'Black dial',
      assets: [{ url: 'https://cdn.example.com/black-front.webp' }],
    },
  ],
};

describe('item mappers', () => {
  it('maps the enriched list query to the public list contract', () => {
    const result = toItemListDto(item);

    expect(result.category.name).toBe('Dive watches');
    expect(result.itemVariants[0].assets).toEqual([
      { url: 'https://cdn.example.com/orange-front.webp' },
    ]);
  });

  it('keeps assets with their owning variant in item details', () => {
    const result = toItemDetailsDto(item);

    expect(result.variants).toEqual([
      expect.objectContaining({
        id: 'variant-1',
        assets: ['https://cdn.example.com/orange-front.webp'],
      }),
      expect.objectContaining({
        id: 'variant-2',
        assets: ['https://cdn.example.com/black-front.webp'],
      }),
    ]);
    expect(result).not.toHaveProperty('assets');
    expect(result).not.toHaveProperty('price');
  });
});
