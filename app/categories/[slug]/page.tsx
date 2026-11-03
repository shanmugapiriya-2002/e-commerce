import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "../../component/header/header";
import styles from "./page.module.scss";

import {
  getCategoryBySlug,
  getProductsByCategorySlug,
} from "@/lib/contentful";

export const instant = false;

type ContentfulImage = {
  fields?: {
    file?: {
      url?: string;
      details?: { image?: { width: number; height: number } };
    };
  };
};

type CategoryFields = {
  categoryName: string;
  categoryImage?: ContentfulImage;
};

type ProductFields = {
  productName: string;
  description?: string;
  price: number;
  originalPrice?: number;
  productImage?: ContentfulImage;
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategorySlug(slug),
  ]);

  if (!category) notFound();

  const categoryFields = category.fields as unknown as CategoryFields;

  return (
    <>
      <div className={styles.heading}>
        <p>SHOP THE COLLECTION</p>
        <h1>{categoryFields.categoryName}</h1>
        <span>{products.length} products</span>
      </div>

      {products.length === 0 ? (
        <p className={styles.empty}>New products are coming soon.</p>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => {
            const p = product.fields as unknown as ProductFields;
            const file = (p.productImage ?? categoryFields.categoryImage)?.fields?.file;
            const dimensions = file?.details?.image;
            const originalPrice = p.originalPrice ?? 0;
            const hasDiscount = originalPrice > p.price;
            return (
              <article key={product.sys.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {file?.url && dimensions && (
                    <Image
                      src={`https:${file.url}`}
                      alt={p.productName}
                      width={dimensions.width}
                      height={dimensions.height}
                      unoptimized
                    />
                  )}
                  {hasDiscount && (
                    <span className={styles.discount}>
                      {Math.round((1 - p.price / originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <h2>{p.productName}</h2>
                {p.description && <p>{p.description}</p>}
                <div className={styles.price}>
                  <strong>{currency.format(p.price)}</strong>
                  {hasDiscount && <s>{currency.format(originalPrice)}</s>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <Suspense fallback={<div className={styles.productGrid} />}>
          <CategoryContent params={params} />
        </Suspense>
      </main>
    </>
  );
}
