package vn.io.naherb.product;

import vn.io.naherb.common.enums.ContentStatus;

public class ProductTestFactory {
    public static Product createProduct(String name, String slug) {
        Product product = new Product() {}; // anonymous subclass to bypass protected constructor? No, Product is not final, but anonymous subclass works if protected
        // wait, since ProductTestFactory is in the SAME PACKAGE vn.io.naherb.product, it can access the protected constructor directly!
        Product p = new Product();
        p.setName(name);
        p.setSlug(slug);
        p.setStatus(ContentStatus.PUBLISHED);
        return p;
    }
}
