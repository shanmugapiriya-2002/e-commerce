
import { getProducts } from "@/lib/contentful";
import styles from "./page.module.scss";

export const instant = false;

export default async function TestContentfulPage() {
  const products = await getProducts();

  return (
    <main className={styles.container}>
      <h1>Our Products</h1>
      <p>Total Products: {products.length}</p>

      <div className={styles.productGrid}>
        {products.map((product) => {
          const fields = product.fields as {
            productName?: string;
            price?: number;
            description?: string;
            productImage?: {
              fields?: {
                file?: {
                  url?: string;
                };
              };
            };
            category?: {
              fields?: {
                categoryName?: string;
              };
            };
          };

          const imageUrl = fields.productImage?.fields?.file?.url;

          return (
            <div className={styles.card} key={product.sys.id}>
              {imageUrl && (
                <img
                  src={
                    imageUrl.startsWith("//")
                      ? `https:${imageUrl}`
                      : imageUrl
                  }
                  alt={fields.productName || "Product"}
                  className={styles.productImage}
                />
              )}

              <div className={styles.details}>
                <p className={styles.category}>
                  {fields.category?.fields?.categoryName}
                </p>

                <h2>{fields.productName}</h2>

                <p className={styles.price}>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(fields.price ?? 0)}
                </p>

                <p className={styles.description}>
                  {fields.description}
                </p>

                <button className={styles.addButton}>
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
