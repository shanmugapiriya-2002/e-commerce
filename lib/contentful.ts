
import "server-only";
import { connection } from "next/server";
import { createClient } from "contentful";

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  throw new Error("Contentful environment variables are missing");
}

export const contentfulClient = createClient({
  space,
  accessToken,
});

export async function getProducts() {
  // The Contentful SDK reads the clock, so it has to run at request time
  await connection();

  const response = await contentfulClient.getEntries({
    content_type: "product",
    include: 2,
  });

  return response.items;
}

export async function getCategories() {
  await connection();

  const response = await contentfulClient.getEntries({
    content_type: "category",
    include: 2,
  });

  return response.items;
}

export async function getCategoryBySlug(slug: string) {
  await connection();

  const response = await contentfulClient.getEntries({
    content_type: "category",
    "fields.categorySlug": slug,
    order: ["sys.createdAt"],
    limit: 1,
    include: 2,
  });

  return response.items[0];
}

export async function getProductsByCategorySlug(slug: string) {
  await connection();

  const response = await contentfulClient.getEntries({
    content_type: "product",
    "fields.category.sys.contentType.sys.id": "category",
    "fields.category.fields.categorySlug": slug,
    order: ["sys.createdAt"],
    include: 2,
  });

  return response.items;
}

export async function getFeaturedProducts() {
  const products = await getProducts();

  return products.filter((product) => {
    const fields = product.fields as { isFeatured?: boolean };
    return fields.isFeatured === true;
  });
}
