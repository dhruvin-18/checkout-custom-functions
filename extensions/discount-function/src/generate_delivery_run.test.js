import { describe, it, expect } from "vitest";

import { generateDeliveryRun } from "./generate_delivery_run";
import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
} from "../generated/api";

/**
 * @typedef {import("../generated/api").CartDeliveryOptionsDiscountsGenerateRunResult} CartDeliveryOptionsDiscountsGenerateRunResult
 * @typedef {import("../generated/api").DeliveryInput} DeliveryInput
 */

describe("generateDeliveryRun", () => {
  const baseInput = {
    cart: {
      deliveryGroups: [
        {
          id: "gid://shopify/DeliveryGroup/0",
        },
      ],
    },
    discount: {
      discountClasses: [],
    }
  };

  it("returns empty operations when no discount classes are present", () => {
    const input = {
      ...baseInput,
      discount: {
        discountClasses: [],
      },
    };

    const result = generateDeliveryRun(input);
    expect(result.operations).toHaveLength(0);
  });

  it("returns delivery discount when shipping discount class is present", () => {
    const input = {
      ...baseInput,
      discount: {
        discountClasses: [DiscountClass.Shipping],
      },
    };

    const result = generateDeliveryRun(input);
    expect(result.operations).toHaveLength(1);
    expect(result.operations[0]).toMatchObject({
      deliveryDiscountsAdd: {
        candidates: [
          {
            message: "FREE DELIVERY",
            targets: [
              {
                deliveryGroup: {
                  id: "gid://shopify/DeliveryGroup/0",
                },
              },
            ],
            value: {
              percentage: {
                value: 100,
              },
            },
          },
        ],
        selectionStrategy: DeliveryDiscountSelectionStrategy.All,
      },
    });
  });

  it("throws error when no delivery groups are present", () => {
    const input = {
      cart: {
        deliveryGroups: [],
      },
      discount: {
        discountClasses: [DiscountClass.Shipping],
      },
    };

    expect(() => generateDeliveryRun(input)).toThrow('No delivery groups found');
  });
});