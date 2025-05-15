// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
/* export function run(input) {
  const configuration = JSON.parse(
    input?.deliveryCustomization?.metafield?.value ?? "{}"
  );

  return NO_CHANGES;
}; */

export function run(input) {
  // The message to be added to the delivery option
  const message = "May be delayed due to weather conditions";

  let toRename = input.cart.deliveryGroups
    // Filter for delivery groups with a shipping address containing the affected state or province
    .filter(group => group.deliveryAddress?.provinceCode &&
      group.deliveryAddress.provinceCode == "NC")
    // Collect the delivery options from these groups
    .flatMap(group => group.deliveryOptions)
    // Construct a rename operation for each, adding the message to the option title
    .map(option => /** @type {Operation} */({
      rename: {
        deliveryOptionHandle: option.handle,
        title: option.title ? `${option.title} - ${message}` : message
      }
    }));

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    operations: toRename
  };
};