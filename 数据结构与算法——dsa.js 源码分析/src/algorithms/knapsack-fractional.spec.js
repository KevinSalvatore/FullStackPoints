const solveFractionalKnapsack = require('./knapsack-fractional');

describe('solveFractionalKnapsack', () => {
  it('should solve take fractional items', () => {
    const maxWeight = 7;
    const items = [
      { value: 1, weight: 1 },
      { value: 4, weight: 3 },
      { value: 5, weight: 4 },
      { value: 7, weight: 5 },
    ];

    const knapsack = solveFractionalKnapsack(items, maxWeight);

    expect(knapsack.weight).toBeCloseTo(5 + ((2 / 3) * 3));
    expect(knapsack.value).toBeCloseTo(7 + ((2 / 3) * 4));
    expect(knapsack.items.length).toEqual(2);
    expect(knapsack.items).toEqual(expect.arrayContaining([
      { value: 7, weight: 5, proportion: 1 },
      { value: 4, weight: 3, proportion: (2 / 3) },
    ]));
  });

  it('should solve whole items', () => {
    const maxWeight = 9;
    const items = [
      { value: 1, weight: 1 }, // 1/1  = 1
      { value: 4, weight: 3 }, // 4/3 = 1.33 ✅
      { value: 5, weight: 4 }, // 5/4 = 1.25
      { value: 7, weight: 5 }, // 7/5 = 1.4 ✅
      { value: 6, weight: 1 }, // 6 ✅
    ];

    const knapsack = solveFractionalKnapsack(items, maxWeight);

    expect(knapsack.items).toEqual(expect.arrayContaining([
      { value: 6, weight: 1, proportion: 1 },
      { value: 7, weight: 5, proportion: 1 },
      { value: 4, weight: 3, proportion: 1 },
    ]));
    expect(knapsack.weight).toBeCloseTo(1 + 5 + 3);
    expect(knapsack.value).toBeCloseTo(6 + 7 + 4);
    expect(knapsack.items.length).toEqual(3);
  });

  it('should take none if max is 0', () => {
    const maxWeight = 0;
    const items = [
      { value: 1, weight: 1 }, // 1/1  = 1
    ];
    const knapsack = solveFractionalKnapsack(items, maxWeight);
    expect(knapsack.items.length).toEqual(0);
    expect(knapsack.weight).toBeCloseTo(0);
    expect(knapsack.value).toBeCloseTo(0);
  });

  it('should take all if capacity allows it', () => {
    const maxWeight = 10;
    const items = [
      { value: 1, weight: 1 }, // 1/1  = 1
    ];
    const knapsack = solveFractionalKnapsack(items, maxWeight);
    expect(knapsack.items.length).toEqual(1);
    expect(knapsack.weight).toBeCloseTo(1);
    expect(knapsack.value).toBeCloseTo(1);
  });

  it('should solve take fractional items with non-integer max weight', () => {
    const maxWeight = 7.5;
    const items = [
      { value: 1, weight: 1 },
      { value: 4, weight: 3 },
      { value: 5, weight: 4 },
      { value: 7, weight: 5 },
    ];

    const knapsack = solveFractionalKnapsack(items, maxWeight);

    expect(knapsack.weight).toBeCloseTo(7.5);
    expect(knapsack.value).toBeCloseTo(7 + ((2.5 / 3) * 4));
    expect(knapsack.items.length).toEqual(2);
    expect(knapsack.items).toEqual(expect.arrayContaining([
      { value: 7, weight: 5, proportion: 1 },
      { value: 4, weight: 3, proportion: (2.5 / 3) },
    ]));
  });
});
