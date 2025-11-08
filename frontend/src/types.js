/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {'customer'|'seller'|'admin'|string} role
 * @property {boolean} [isVerified]
 */

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} title
 * @property {string[]} [imageLinks]
 * @property {string|Object} [category] // id or populated object
 * @property {number} [price]
 * @property {number} [discountPrice]
 * @property {string} [description]
 * @property {number} [stock]
 * @property {string} [deliveryType]
 * @property {string} [brand]
 * @property {string} [sku]
 * @property {string[]} [tags]
 * @property {boolean} [isFeatured]
 */

/**
 * @typedef {Object} Category
 * @property {string} _id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [image]
 * @property {string} [slug]
 */

/**
 * @typedef {Object} Booking
 * @property {string} _id
 * @property {string} product
 * @property {number} quantity
 * @property {string} [buyer]
 * @property {string} [seller]
 */
