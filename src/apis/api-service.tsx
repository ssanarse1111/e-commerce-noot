// Get All Products
export async function getAllProducts() {
    const response = await fetch('http://localhost:3006/products');
    return response.json();
}

// get All Categories
export async function getAllCategories(product: any) {
    const response = await fetch('http://localhost:3006/categories');
    return response.json();
}

// get All Attributes
export async function getAllAttributes(product: any) {
    const response = await fetch('http://localhost:3006/attributes');
    return response.json();
}

// Get Product
export async function getProduct(id: any) {
    const response = await fetch(`http://localhost:3006/products/${id}`);
    return response.json();
}

// Create Product
export async function createProduct(product: any) {
    const response = await fetch(`http://localhost:3006/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
    return response.json();
}

// Update Product
export async function updateProduct(product: any) {
    const response = await fetch(`http://localhost:3006/products/${product.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
    return response.json();
}

// Delete Product
export async function deleteProduct(id: any) {
    const response = await fetch(`http://localhost:3006/products/${id}`, {
        method: "DELETE",
    });
    return response.json();
}