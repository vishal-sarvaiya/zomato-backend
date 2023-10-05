        /*****************************For Fetching Order for Restaurant******************************************** */
        // const supplierId = "64e47422cb983acb410841b9"

        // const agregatedData = await order.aggregate([
        //     // Match orders that have items from the desired supplier
        //     {
        //         $match: {
        //             "order_items.restaurantID": supplierId
        //         }
        //     },
        //     // Unwind the OrderItems array to work with individual items
        //     {
        //         $unwind: "$order_items"
        //     },
        //     // Match items that belong to the desired supplier
        //     {
        //         $match: {
        //             "order_items.restaurantID": supplierId
        //         }
        //     },

        //     // Project to shape the output
        //     {
        //         $project: {
        //             _id: 0,
        //             OrderID: "$_id",
        //             ProductID: "$order_items.foodID",
        //             Quantity: "$order_items.quantity",
        //             UnitPrice: "$order_items.price",
        //             Subtotal: "$order_items.subTotal"
        //         }
        //     }
        // ]).exec()

        // console.log('Supplier Orders:', agregatedData);


        // .exec((err, supplierOrders) => {
        //     if (err) {
        //         console.error('Error:', err);
        //     } else {
        //         console.log('Supplier Orders:', supplierOrders);
        //     }
        // });
        // console.log("newOrder", newOrder);
        // // restaurant_id
        // food.map((foodProduct, index) => {
        //     const restaurantId = foodProduct.restaurant_id
        //     const orderData = restaurant.findByIdAndUpdate(
        //         {_id:restaurantId},
        //         {
        //             orders: {
        //               
        //                
        //                 price: foodProduct.price,
        //            
        //                 quantity: foodProduct.quantity,
        //                 _id: foodProduct._id,
        //                 restaurant_id: foodProduct.restaurant_id,
        //                 user_id: userId,
        //                 payment_method: payment_method,
        //                 status: status,
        //                 order_id: newOrder._id
        //             }
        //         },
        //     )

        // })