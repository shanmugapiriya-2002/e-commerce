import { Suspense } from "react";
import Image from "next/image";
import Header from "./component/header/header";
import styles from "./page.module.scss";
import bannerImage from "./assests/pannerImg.png";

import {
  getCategories,
  getFeaturedProducts,
} from "@/lib/contentful";

export const instant = false;

// Category order
const ORDER = ["men", "woman", "electronics", "home-living"];

// Category Cards
async function CategoryCards() {
  const categories = (await getCategories()) as any[];

  // Sort categories based on our preferred order
  const sortedCategories = [...categories].sort((a, b) => {
    const aSlug = a.fields.categorySlug;
    const bSlug = b.fields.categorySlug;

    return ORDER.indexOf(aSlug) - ORDER.indexOf(bSlug);
  });

  return (
    <div className={styles.categoryGrid}>
      {sortedCategories.map((category) => {
        const fields = category.fields;

        const imageUrl =
          fields.categoryImage?.fields?.file?.url;

        return (
          <a
            key={category.sys.id}
            href={`/categories/${fields.categorySlug}`}
            className={styles.categoryCard}
          >
            <div className={styles.categoryImage}>
              {imageUrl && (
                <img
                  src={`https:${imageUrl}`}
                  alt={fields.categoryName}
                />
              )}
            </div>

            <h3>{fields.categoryName}</h3>

            <span>Explore Collection →</span>
          </a>
        );
      })}
    </div>
  );
}

// Featured Products
async function FeaturedProducts() {
  const products = (await getFeaturedProducts()) as any[];

  return (
    <div className={styles.productGrid}>
      {products.map((product) => {
        const fields = product.fields;

        const imageUrl =
          fields.productImage?.fields?.file?.url;

        return (
          <div
            key={product.sys.id}
            className={styles.productCard}
          >
            {imageUrl && (
              <img
                src={`https:${imageUrl}`}
                alt={fields.productName}
                className={styles.productImage}
              />
            )}

            <div className={styles.productDetails}>
              <p>
                {fields.category?.fields?.categoryName}
              </p>

              <h3>{fields.productName}</h3>

              <strong>
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(fields.price)}
              </strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Home Page
export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.subtitle}>
              NEW COLLECTION 2026
            </p>

            <h1>
              Upgrade Your Style
              <br />
              This Season
            </h1>

            <p className={styles.description}>
              Discover your favourite products at Priya Store.
              Find the perfect style for every moment.
            </p>

            <a href="/products" className={styles.shopButton}>
              Shop Now →
            </a>
          </div>

          <div className={styles.heroImage}>
            <Image
              src={bannerImage}
              alt="Priya Store fashion collection"
              priority
              sizes="(max-width: 768px) 70vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>

        {/* Categories Section */}
        <section className={styles.categories}>
          <div className={styles.sectionHeading}>
            <p>EXPLORE OUR COLLECTION</p>
            <h2>Shop by Category</h2>
            <span>Find something you love</span>
          </div>

          <Suspense
            fallback={
              <div className={styles.categoryGrid}>
                Loading categories...
              </div>
            }
          >
            <CategoryCards />
          </Suspense>
        </section>

        {/* Featured Products Section */}
        <section className={styles.categories}>
          <div className={styles.sectionHeading}>
            <p>OUR BEST PICKS</p>
            <h2>Featured Products</h2>
            <span>Discover our popular products</span>
          </div>

          <Suspense fallback={<p>Loading products...</p>}>
            <FeaturedProducts />
          </Suspense>
        </section>
      </main>
    </>
  );
}
