'use strict';
const stripe = require("stripe")("sk_test_51J4xxLCkWRdX970kPJzshjHrnfBdxIM32GKCdm2uuDICG7ISu5WVZ0W6sRVeEdjvtna7ivJl3yCeaCZx968gTCvM00dU6HuOMd")

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { token, products, idUser} = ctx.request.body;
    let totalPayment = 0;
    products.forEach((product) => {
      totalPayment = totalPayment + product.price;
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
        product: product.id,
        user: idUSer,
        totalPayment,
        idPayment: charge.id,
      }
      const validData = await createStrapi.entityValidator.validateEntity(
        strapi.models.detalle-compra,
        data
      );
      const entry = await strapi.query("detalle-compra").create(validData);
      createOrder.push(entry);
    }
    return createOrder;
  },
};
