'use strict';
const stripe = require("stripe")("sk_test_51J4xxLCkWRdX970kPJzshjHrnfBdxIM32GKCdm2uuDICG7ISu5WVZ0W6sRVeEdjvtna7ivJl3yCeaCZx968gTCvM00dU6HuOMd")

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { token, products, idUser, metodoDespacho, metodoCompra} = ctx.request.body;
    console.log("id user => ", idUser)
    let totalPayment = 0;
    products.forEach((product) => {
      totalPayment = totalPayment + product.precio;
    });

    const charge = await stripe.charges.create({
      amount: totalPayment * 100,
      currency: "eur",
      source: token.id, //Id de la compra 
      description: `ID Usuario: ${idUser}`, 
    });

    const createOrder = [];
    for await(const product of products){
      const data = {
        producto: product.id,
        user: idUser,
        totalCompra: totalPayment,
        idPayment: charge.id,
        metodoDespacho,
        metodoCompra
      }
      const validData = await strapi.entityValidator.validateEntityCreation(
        strapi.models.order,
        data
      );
      const entry = await strapi.query("order").create(validData);
      createOrder.push(entry);
    }
    return createOrder;
  },
};
