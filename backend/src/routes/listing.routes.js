const asyncHandler = require("../config/asyncHandler");
const {
  getListings,
  getListingById,
  createNewListing,
  getMyListings,
  deleteListing,
  getPendingListings,
  updateListingsStatus,
} = require("../controllers/listing.controllers");
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyToken = require("../middlewares/verifyToken");

const listingRouter = require("express").Router();

/**
 * @description get all listings
 */
listingRouter.get("/", asyncHandler(getListings));

/**
 * @description get user's listings
 */

listingRouter.get(
  "/mine",
  asyncHandler(verifyToken),
  asyncHandler(getMyListings),
);

/**
 * @description get listing by id
 */
listingRouter.get("/:id", asyncHandler(getListingById));

/**
 * @description create new listing
 */

listingRouter.post(
  "/",
  asyncHandler(verifyToken),
  asyncHandler(createNewListing),
);
/**
 * @description delete listing
 */

listingRouter.delete('/:id',asyncHandler(verifyToken),asyncHandler(deleteListing))


/**
 * @description admin routes
 */


listingRouter.get('/admin/getpending',asyncHandler(verifyToken),asyncHandler(verifyAdmin),asyncHandler(getPendingListings))

listingRouter.patch('/admin/:id',asyncHandler(verifyToken),asyncHandler(verifyAdmin),asyncHandler(updateListingsStatus))

module.exports = listingRouter;
