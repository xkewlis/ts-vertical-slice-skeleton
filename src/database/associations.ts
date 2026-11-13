// Relaciones entre modelos de distintos features. Ejemplo:
//
// ProductSequelize.hasMany(OrderItemSequelize, {
//     foreignKey: 'productId',
//     as: 'orderItems',
// });
//
// OrderItemSequelize.belongsTo(ProductSequelize, {
//     foreignKey: 'productId',
//     as: 'product',
// });
export function associations() {
}
