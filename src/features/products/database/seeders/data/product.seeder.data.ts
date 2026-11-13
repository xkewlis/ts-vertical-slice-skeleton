// Datos iniciales de products. El uuid es fijo para que el upsert sea idempotente
// y el registro se pueda referenciar desde otros seeders.
export default [
    {
        uuid: '6f1c2a3e-8b4d-4e5f-9a1b-2c3d4e5f6a7b',
        sku: 'LAP-001',
        name: 'Laptop 14"',
        description: 'Laptop de 14 pulgadas, 16GB RAM',
        price: '899.90',
        stock: 10,
    },
    {
        uuid: '7a2d3b4f-9c5e-4f60-8b2c-3d4e5f6a7b8c',
        sku: 'MOU-001',
        name: 'Mouse inalámbrico',
        description: null,
        price: '19.90',
        stock: 150,
    },
    {
        uuid: '8b3e4c5a-ad6f-4071-9c3d-4e5f6a7b8c9d',
        sku: 'KEY-001',
        name: 'Teclado mecánico',
        description: 'Switches rojos, layout español',
        price: '79.50',
        stock: 40,
    },
]
