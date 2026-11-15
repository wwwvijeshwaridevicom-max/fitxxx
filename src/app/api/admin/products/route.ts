import { NextRequest, NextResponse } from 'next/server';
import { adminStore, logAuditAction, verifyAdminAccess } from '@/lib/server-admin';
import { ALL_PRODUCTS } from '@/data/products';

export async function GET(req: NextRequest) {
  // Allow fetching products with their real-time matrix inventory
  const inventoryList = Array.from(adminStore.inventory.values());
  
  const productsWithStock = ALL_PRODUCTS.map(prod => {
    const prodInventory = inventoryList.filter(inv => inv.productId === prod.id);
    const totalStock = prodInventory.reduce((acc, curr) => acc + curr.stockCount, 0);
    return {
      ...prod,
      stockCount: totalStock,
      matrixInventory: prodInventory,
    };
  });

  return NextResponse.json({
    success: true,
    products: productsWithStock,
    totalCount: productsWithStock.length,
  });
}

export async function PUT(req: NextRequest) {
  // Check RBAC permission (OWNER, ADMIN, INVENTORY_MANAGER allowed)
  const auth = verifyAdminAccess(req, ['OWNER', 'ADMIN', 'INVENTORY_MANAGER']);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }
  const user = auth.user;

  try {
    const body = await req.json();
    const { action, productId, colorHex, size, newStock, newPrice, newComparePrice, notes } = body;

    // Action 1: Update Variant Stock Count
    if (action === 'UPDATE_STOCK') {
      const targetProduct = ALL_PRODUCTS.find(p => p.id === productId || p.signatureCode === productId || p.slug === productId);
      const resolvedProductId = targetProduct ? targetProduct.id : productId;
      const invKey = `${resolvedProductId}-${colorHex}-${size}`;
      const existing = adminStore.inventory.get(invKey);
      const oldStock = existing ? existing.stockCount : 0;
      
      const updatedItem = {
        id: invKey,
        productId: resolvedProductId,
        colorHex,
        colorName: existing?.colorName || targetProduct?.colors?.find(c => c.hex.toLowerCase() === colorHex.toLowerCase())?.name || 'Default Color',
        size: size as any,
        stockCount: Math.max(0, parseInt(newStock, 10)),
        reservedCount: existing?.reservedCount || 0,
        lowStockThreshold: existing?.lowStockThreshold || 5,
        updatedAt: new Date().toISOString(),
      };

      adminStore.inventory.set(invKey, updatedItem);

      logAuditAction(
        'STOCK_UPDATE',
        'inventory',
        `${productId} [${size}/${colorHex}]`,
        { stock: oldStock },
        { stock: updatedItem.stockCount },
        notes || `Stock adjusted for size ${size}`,
        user?.email
      );

      return NextResponse.json({
        success: true,
        message: `Stock updated to ${updatedItem.stockCount}`,
        item: updatedItem,
      });
    }

    // Action 2: Update Product Price
    if (action === 'UPDATE_PRICE') {
      logAuditAction(
        'PRICE_CHANGE',
        'product',
        productId,
        { price: body.oldPrice },
        { price: newPrice, compareAtPrice: newComparePrice },
        notes || 'Product price updated from admin console',
        user?.email
      );

      return NextResponse.json({
        success: true,
        message: 'Product price updated successfully',
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
